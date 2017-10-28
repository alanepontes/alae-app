const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./src/report/report.json', 'utf8'));

const deficienciesPopulationInPercent = JSON.parse(fs.readFileSync('./src/mappers/deficienciesPopulationInPercent.json', 'utf8'));

const deficienciesByGuideline = JSON.parse(fs.readFileSync('./src/mappers/deficienciesByGuideline.json', 'utf8'));
const deficienciesTotalByGuideline = JSON.parse(fs.readFileSync('./src/mappers/deficienciesTotalByGuideline.json', 'utf8'));

const totalUsersInApplication = JSON.parse(fs.readFileSync('./src/mappers/totalUsersInApplication.json', 'utf8'));

const alertsByDeficienciesAffecteds = report.map(item => {
    const regex = /\w+.\w+.\w+.(\d{1}_\d{1}_\d{1}).([A-Z]{1}[0-9]{2})/g;
    const [_, code, technique ] = regex.exec(item.code);
    
    const alertByDeficiencieAffected = {}
    alertByDeficiencieAffected.code = code.replace(/_/g, '.'); 
    alertByDeficiencieAffected.technique = technique;
    alertByDeficiencieAffected.deficiencies = deficienciesByGuideline[alertByDeficiencieAffected.code];
    
    const mergeAlertByDeficiencieAffected = Object.assign({}, item, alertByDeficiencieAffected);
    
    return mergeAlertByDeficiencieAffected;
});

let arrDificienceAffectedTotal = []
Object.keys(deficienciesTotalByGuideline).forEach(function(deficient) {
    
    const object = {};
    
    const totalItensGuidelineByDeficient = deficienciesTotalByGuideline[deficient];
    const countErrorByDeficienciesAffecteds = alertsByDeficienciesAffecteds.reduce(
        (total, item) => {
            if (item.deficiencies.indexOf(deficient) !== -1) {
                total++;
            }         
            return total;
        },
        0
    );    
    object['deficient'] = {
        'name' : deficient,
        'percentErrors' : (countErrorByDeficienciesAffecteds/totalItensGuidelineByDeficient*100).toFixed(2),
        'errorsFounds' : countErrorByDeficienciesAffecteds,
        'guideline' : totalItensGuidelineByDeficient
    }

    arrDificienceAffectedTotal.push(object);
}); 


let probablyUsersAffected = [] 

Object.keys(deficienciesPopulationInPercent).forEach(function(key) {
    const totalPercentBydeficienciesPopulation = deficienciesPopulationInPercent[key];
    
    const numbersOfUsers = (totalPercentBydeficienciesPopulation/100) * totalUsersInApplication['TOTAL'];
    const probablyNumbersUsersAffected =  numbersOfUsers * arrDificienceAffectedTotal.filter(item => {
        return item.deficient.name === key
    }).shift().deficient.percentErrors;
    
    
    probablyUsersAffected.push({
        numbersOfUsers : numbersOfUsers.toFixed(2),
        probablyNumbersUsersAffected : probablyNumbersUsersAffected.toFixed(2), 
        name : key

    });
});

const result = {
    'errors' : alertsByDeficienciesAffecteds.sort((a, b) => a.typeCode - b.typeCode),
    'percentErrorsInDeficiencesByGuideline' : arrDificienceAffectedTotal,
    'probablyUsersAffected' : probablyUsersAffected
}

fs.writeFileSync('./dist/result.json', JSON.stringify(result));

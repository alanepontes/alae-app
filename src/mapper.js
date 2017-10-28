const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./src/report/report.json', 'utf8'));

const deficienciesPopulation = JSON.parse(fs.readFileSync('./src/mappers/deficienciesPopulation.json', 'utf8'));

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
    object[deficient] = 0;
    
    const totalDeficient = deficienciesTotalByGuideline[deficient];
    const countErrorByDeficienciesAffecteds = alertsByDeficienciesAffecteds.reduce(
        (total, item) => {
            if (item.deficiencies.indexOf(deficient) !== -1) {
                total++;
            }         
            return total;
        },
        0
    );    
    object[deficient] = countErrorByDeficienciesAffecteds/totalDeficient*100;
    arrDificienceAffectedTotal.push(object);
}); 

console.log(arrDificienceAffectedTotal);

fs.writeFileSync('./dist/result.json', JSON.stringify(alertsByDeficienciesAffecteds));

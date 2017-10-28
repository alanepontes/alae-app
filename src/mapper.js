const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./src/report/report.json', 'utf8'));

const deficienciesPercentPopulation = JSON.parse(fs.readFileSync('./src/mappers/deficienciesPercentPopulation.json', 'utf8'));

const deficienciesByGuideline = JSON.parse(fs.readFileSync('./src/mappers/deficienciesByGuideline.json', 'utf8'));
const deficienciesTotalByGuideline = JSON.parse(fs.readFileSync('./src/mappers/deficienciesTotalByGuideline.json', 'utf8'));

const totalUsersInApplication = JSON.parse(fs.readFileSync('./src/mappers/totalUsersInApplication.json', 'utf8'));



const mappedCriteriaReport = report.map(item => {
    const code = item.code.split('.');
    item.standardName = code[0];
    item.principle = code[1];
    item.guideline = code[2];
    item.parsedCriteria = code[3].replace(/_/g,'.');
    item.techniques = code[4].split(',');
    item.affecteds = deficienciesByGuideline[item.parsedCriteria.toString()];
    return item;
});

fs.writeFileSync('./dist/result.json', JSON.stringify(mappedCriteriaReport));
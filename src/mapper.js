const fs = require('fs');
const fa11yReport = JSON.parse(fs.readFileSync('./src/report/report.json', 'utf8'));
const deficienciesInCriterias = JSON.parse(fs.readFileSync('./src/mappers/guidelines.json', 'utf8'));
const mappedCriteriaReport = fa11yReport.map(item => {
    const code = item.code.split('.');
    item.standardName = code[0];
    item.principle = code[1];
    item.guideline = code[2];
    item.parsedCriteria = code[3].replace(/_/g,'.');
    item.techniques = code[4].split(',');
    item.affecteds = deficienciesInCriterias[item.parsedCriteria.toString()];
    return item;
});

fs.writeFileSync('./dist/result.json', JSON.stringify(mappedCriteriaReport));
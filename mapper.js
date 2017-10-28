const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('report.json', 'utf8'));
const mappedObj = obj.map(item => {
    const code = item.code.split('.');
    item.standardName = item.code[0];
    item.principle = item.code[1];
    item.guideline = item.code[2];
    item.parsedCriteria = code[3].replace(/_/g,'.');
    item.techniques = code[4].split(',');
    item.affecteds = ['visao','audicao'];
    return item;
});

fs.writeFileSync('result.json', JSON.stringify(mappedObj));
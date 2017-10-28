const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('report.json', 'utf8'));
const mappedObj = obj.map(item => {
    const code = item.code.split('.');
    const standardName = item.code[0];
    const principle = item.code[1];
    const guideline = item.code[2];
    const parsedCriteria = code[3].replace(/_/g,'.');
    const techniques = code[4].split(',');
    item.affecteds = ['visao','audicao'];
    item.techniques = techniques;
    return item;
});

fs.writeFileSync('result.json', JSON.stringify(mappedObj));
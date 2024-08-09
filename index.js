const fs = require('fs').promises;
const inquirer = require('inquirer');

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

async function readJson() {
    try {
        const searchNameResponse = await inquirer.prompt({
            name: 'targetName',
            message: 'Deseja consultar os dados de qual conta?'
        });

        const searchName = searchNameResponse.targetName;
        const data = await fs.readFile('registeredAccounts.json', 'utf-8');
        const existingNames = JSON.parse(data);

        const account = existingNames.find(acc => acc.Name == searchName);

        if (account) {
            const { Name: accountName, Age: accountAge, CivilState: accountCivilState, Balance: accountBalance } = account;
            return { accountName, accountAge, accountCivilState, accountBalance };
        } else {
            console.log('Conta não encontrada.');
            return null;
        }
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function makeQuestion() {
    return inquirer.prompt([{
        type: 'list',
        name: 'question',
        message: 'O que você deseja fazer?',
        choices: ['Criar conta', 'Consultar saldos', 'Depositar', 'Sacar', 'Sair']
    }]);
}

async function accountCreation() {
    const nameResponse = await inquirer.prompt({
        name: 'accountName',
        message: 'Digite seu nome: '
    });

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(nameResponse.accountName)) {
        console.log("Nomes não podem conter números!");
        return;
    }

    const ageResponse = await inquirer.prompt({
        name: 'accountAge',
        message: 'Digite sua idade: ',
        validate: function (age) {
            const valid = !isNaN(parseInt(age));
            return valid || 'Insira uma idade válida.';
        }
    });

    if (parseInt(ageResponse.accountAge) < 18) {
        console.log('Menores de 18 anos não podem ser cadastrados');
        return;
    }

    const civilStateResponse = await inquirer.prompt({
        type: 'list',
        name: 'accountCivilState',
        message: 'Escolha seu estado civil: ',
        choices: ['Casado', 'Divorciado', 'Separado', 'Solteiro', 'Viúvo']
    });

    const newData = {
        Name: nameResponse.accountName,
        Age: ageResponse.accountAge,
        CivilState: civilStateResponse.accountCivilState,
        Balance: 0
    };

    try {
        const fileExistsFlag = await fileExists('registeredAccounts.json');
        let existingData = [];
        if (fileExistsFlag) {
            const data = await fs.readFile('registeredAccounts.json', 'utf-8');
            existingData = JSON.parse(data);
        }
        existingData.push(newData);
        await fs.writeFile('registeredAccounts.json', JSON.stringify(existingData, null, 2), 'utf-8');
        console.log('Dados salvos com sucesso em registeredAccounts.json');
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function checkBalanceInAccount() {
    try {
        const { accountBalance } = await readJson();
        if (accountBalance !== undefined) {
            console.log(`Valor disponível em conta: ${accountBalance}`);
            return accountBalance;
        }
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function makeDeposit() {
    try {
        const valueInAccount = parseFloat(await checkBalanceInAccount());
        if (isNaN(valueInAccount)) return;

        const valueToDepositResponse = await inquirer.prompt({
            name: 'value',
            message: 'Quanto você deseja depositar?'
        });

        const valueToDeposit = parseFloat(valueToDepositResponse.value);

        const data = await fs.readFile('registeredAccounts.json', 'utf-8');
        let valueInJson = JSON.parse(data);

        const accountIndex = valueInJson.findIndex(acc => acc.Balance == valueInAccount);
        if (accountIndex !== -1) {
            valueInJson[accountIndex].Balance = valueInAccount + valueToDeposit;
            await fs.writeFile('registeredAccounts.json', JSON.stringify(valueInJson, null, 2), 'utf-8');
            console.log('Valor alterado com sucesso!');
            console.log(`Você depositou ${valueToDeposit}, saldo total ${valueInAccount + valueToDeposit}`);
        } else {
            console.log('Conta não encontrada.');
        }
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function cashWithdraw() {
    try {
        const valueInAccount = parseFloat(await checkBalanceInAccount());
        if (isNaN(valueInAccount)) return;

        if (valueInAccount > 0) {
            const valueToWithdrawResponse = await inquirer.prompt({
                name: 'value',
                message: 'Quanto você deseja sacar?'
            });

            const valueToWithdraw = parseFloat(valueToWithdrawResponse.value);

            if (valueToWithdraw <= valueInAccount) {
                const data = await fs.readFile('registeredAccounts.json', 'utf-8');
                let valueInJson = JSON.parse(data);

                const accountIndex = valueInJson.findIndex(acc => acc.Balance == valueInAccount);
                if (accountIndex !== -1) {
                    valueInJson[accountIndex].Balance = valueInAccount - valueToWithdraw;
                    await fs.writeFile('registeredAccounts.json', JSON.stringify(valueInJson, null, 2), 'utf-8');
                    console.log('Valor alterado com sucesso!');
                    console.log(`Você sacou ${valueToWithdraw}, saldo restante ${valueInAccount - valueToWithdraw}`);
                } else {
                    console.log('Conta não encontrada.');
                }
            } else {
                console.log('Valor desejado maior que o valor em conta.');
            }
        } else {
            console.log('Sem dinheiro em conta para o saque!');
        }
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function callActions(answer) {
    if (answer.question == 'Criar conta') {
        console.log('Você escolheu criar uma conta!');
        await accountCreation();
    } else if (answer.question == 'Consultar saldos') {
        console.log('Você escolheu consultar saldo!');
        await checkBalanceInAccount();
    } else if (answer.question == 'Depositar') {
        console.log('Você escolheu efetuar um depósito!');
        await makeDeposit();
    } else if (answer.question == 'Sacar') {
        console.log('Você escolheu fazer um saque!');
        await cashWithdraw();
    } else if (answer.question == 'Sair') {
        console.log('Você escolheu sair!');
        console.log('Você escolheu sair.');
        return false;
    }
    return true;
}

async function main() {
    let continueLoop = true;
    while (continueLoop) {
        const answer = await makeQuestion();
        continueLoop = await callActions(answer);
    }
}

main();

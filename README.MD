# A proposta do projeto
Este projeto foi um dos diversos propostos pelo instrutor Matheus Battsti *[Node.js do Zero a Maestria com diversos Projetos](https://www.udemy.com/course/nodejs-do-zero-a-maestria-com-diversos-projetos/?couponCode=KEEPLEARNING)*.
Apesar de haver um passo-a-passo para a criação do projeto, optei por ver a aula de apresentação, entendendo a proposta e colocando a mão na massa com aquilo que foi apresentado no decorrer das aulas. Adicionei algumas "regras" que acredito que fariam mais sentido com aquilo que foi apresentado.
Em suma, é uma simulação do sistema de um banco, com criação de conta, consulta de saldo, opção de saque e depósito, e todos os valores seriam armazenados dentro de um arquivo _JSON_.

## O código
Embora haja muito espaço para melhorar a leitura do código, procurei ao máximo separar cada ação em funções isoladas.

### Main
Esta tem por objetivo a chamada de duas funções auxiliares, `makeQuestion()` que tem oferece as opções dispóniveis.
Com a escolha da ação que deve ser tomada, chamamos `callActions(answer)` que recebe a resposta da função anterior, e direciona para a função específica da opção escolhida.
Essa função se repetirá até que a opção "sair" seja selecionada.

### AccountCreation
São feitas três perguntas básicas, nome, idade e estado civil, e armazenadas dentro da variável `newData`. Após é feita a verificação da existencia do arquivo que receberá essas informações, caso não exista é criado um novo arquivo e as informações são armazenadas. Se o arquivo for existente, os dados já existentes são adicionados em uma _array_, depois os novos dados são adicionados nessa _array_ e o arquivo é reescrito com os novos dados.

### CheckBalanceInAccount
Em suma essa função é só o retorno de um dos valores da função auxiliar `readJson()`, que tem por objetivo retornar todas as informações da conta selecionada.

### MakeDeposit
Fazendo novamente o uso da função `readJson()` é feita a pergunta do valor que o usuário deseja depositar, e então é somado ao valor já existente dentro da sua conta.

### CashWithdraw
Novamente a função `readJson()` é chamada, e é feita a consulta do valor disponível na conta do usuário, caso o valor seja zero, a função é interrompida, visto que não há o que ser depositado.
Mas caso haja algum valor é perguntado ao usuário o quanto ele deseja sacar, e outra condicional é ativada, conferindo se o valor é sacado é maior do que o valor em posse do usuário.

## Conclusão
Dessa maneira o projeto se encerra, buscando fortalecer bastante o uso dos módulos `fs` para a manipulação dos arquivos, e também `inquirer` que permite que haja uma interação dos usuários com o sistema.
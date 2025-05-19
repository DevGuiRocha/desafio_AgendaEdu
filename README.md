
# Desafio AgendaEdu

Olá, aqui é o Guilherme. Responsável por este pequeno ~(grande)~ projeto. Ele foi feito com base em um desafio técnico, então irei detalhar o máximo de informações possíveis. Caso você tenha aparecido aqui sem fazer parte da equipe técnica, sinta-se livre para verificar o código e caso queira manter um contato, pode acessar meu [LinkedIn](https://www.linkedin.com/in/guilherme-rocha-828701b6/).

Agora, retornando a explicação do desafio... Ele consiste em uma API desenvolvida em Ruby On Rails e um FrontEnd utilizando React + Vite, aplicando boas práticas de projeto e também oferecendo uma cobertura de testes para as principais funcionalidades. A API possui 3 endpoints ~que serão detalhados em breve~ e aproximadamente 4 telas.


## Funcionalidades
Este projeto contempla as principais funcionalidades de acordo com requisitos previamente estabelecidos, como salvar os dados em tabelas do Banco de Dados, listagem de deputados, destacar a maior despesa e listagem das despesas, por exemplo. Mas também conta com algumas funcionalidades extras, sendo elas:

- Possibilidade de importação do Arquivo CSV contendo as despesas dos deputados, que pode ser encontrado acessando este [link](https://dadosabertos.camara.leg.br/swagger/api.html?tab=staticfile#staticfile);
- Filtro dos deputados, podendo ser tanto pelo Nome do deputado como seu partido, ambos filtros em RealTime;
- Select com opções para exibir a quantidade de despesas
    - Para uma melhor visualização, foi definido 10 registros inicialmente, mas esse valor pode ser alterado entre 10, 20, 30, 40 e 50; que ao ser alterado, a tela de despesas é recarregada automaticamente.

## Documentação da API

Como dito inicialmente, esta API conta com 3 endpoints, sendo 2 GET e um POST. Acompanhe abaixo para identificar melhor os endpoints.

#### Retorna todos os deputados 

```http
    GET /deputados
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
|  |  |  |

Para este Endpoint, não é necessário nenhum Parâmetro, portanto apenas executar a requisição já é retornado o JSON, seguindo o exemplo abaixo:

```bash
[
	{
		"id": Int,
		"ide_cadastro": Int,
		"nome_parlamentar": "String",
		"sg_uf": "String",
		"sg_partido": "String",
		"maior_despesa": Real,
		"total_gastos": Real,
		"qtde_despesa": Int
	}
]
```

#### Retorna todas as despesas de um determinado deputado

```http
    GET /deputados/${id}/despesas
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `Int` | **Obrigatório**. O ID do deputado a ser consultado as despesas |

Ao ser executado com sucesso, é retornado um arquivo JSON, seguindo o formato abaixo:

```bash
[
	{
		"id": Int,
		"nome_parlamentar": "String",
		"ide_cadastro": Int,
		"dat_emissao": Date,
		"txt_fornecedor": "String",
		"vlr_liquido": Real,
		"url_documento": "String",
		"is_maior_despesa": Boolean
	}
]
```

#### Envia arquivo para processamento de informações

```http
    POST import/arquivo_csv
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `file`      | `formData` | **Obrigatório**. O arquivo CSV que será processado |

Ao ser processado corretamente, será retornado o seguinte JSON:

```bash
{
	"message": "Upload realizado com sucesso! Importação iniciada automaticamente."
}
```

O arquivo em questão obrigatoriamente deve ser com a extensão .csv; caso seja enviado com qualquer outro formato, terá como retorno o JSON abaixo:

```bash
{
	"error": "Formato inválido. Apenas arquivos .csv são permitidos."
}
```
## Instalação

Para realizar a instalação do projeto, primeiramente faça o clone deste repositório. Para isso, basta colar o comando abaixo no seu terminal:

```bash
    git clone https://github.com/DevGuiRocha/desafio_AgendaEdu.git
```
Após o clone do repositório, é necessário a instalação de algumas gems e bibliotecas para uma boa execução das funcionalidades. Para isso, é necessário a divisão em dois passos:

### Instalação das Gems (Ruby on Rails)

Para a instalação das gems, é necessário acessar o repositório referente ao BackEnd. Para isso, execute o seguinte comando na raiz do projeto:

```bash
    cd ceap-backend
```

Após acessar a página, execute o seguinte comando:

```bash
    bundle install
```

Este comando irá instalar e configurar as gems no arquivo Gemfile, para que possa ser utilizado o sistema sem maiores complicações.

### Instalação das bibliotecas (React)

Para a instalação das bibliotecas, é necessário acessar o repositório responsável pelo FrontEnd. Para isso, execute o seguinte comando na raiz do projeto:

```bash
    cd ceap-frontend
```

Após acessar o repositório, execute o comando:

```bash
    npm install
```

Ao executar esse comando, será lido seu arquivo ```package.json``` e tudo que estiver listado em ```dependencies``` e ```devDependencies``` será baixado.

## Rodando localmente

Após a instalação das Gems/Bibliotecas necessárias, é necessárioa criação da base de dados, que será utilizada para armazenamento das informações. Se necessário, edite o arquivo ```ceap-backend/config/database.yml``` para alterar as configurações para seu ambiente local, assim como usuario e senha do PostgreSQL para conexões. 

### Iniciando servidor BackEnd

Ao finalizar a configuração do arquivo mencionado, vá para a raiz do projeto e execute os seguintes passos:

```bash
	cd ceap-backend
	rails db:create
  	rails db:migrate
```

Após as migrations serem concluidas, já é possível iniciar o servidor rails.Para isso, execute o seguinte comando:

```bash
  	rails s
```

Com o comando acima, o rails irá executar na porta padrão 3000. Com o servidor iniciado, acesse o link ```http://localhost:3000```.


### Iniciando servidor FrontEnd

Ao finalizar a configuração do arquivo mencioado, e subir o servidor rails, abra um novo terminal e navege até a raiz do projeto. Ao chegar na raiz, execute os seguintes comandos:

```bash
	cd ceap-frontend
	npm run dev
```
Com a execução dos comandos, será iniciado o servidor frontend. Para acessar, basta acessar o link ```http://localhost:5173```


**Lembre-se: Para que seja possível a visualização no navegador, é importante que ambos servidores sejam iniciados, visto que o FrontEnd se comunica com o BackEnd para acesso aos dados**

## Rodando os testes

Por ser duas 'aplicações' distintas, foram criados testes separados para validar pontos tanto no BackEnd como no FrontEnd. Mais abaixo será detalhado a execução de cada um.


### Executando testes no BackEnd

Para a execução dos testes, navege até a raiz do projeto e execute os seguintes comandos:

```bash
    cd ceap-backend
    bundle exec rspec spec
```

Com o último comando, será executado todos os testes que foram escritos para a API. Os testes foram divididos para melhor compreensão e validação dos pontos da API, sendo estes Models, Requests, Services e até mesmo Tasks. Caso deseje executar os testes individuais de cada ponto anteriormente citado, basta executar um dos comandos abaixo, de forma individual:

```bash
    bundle exec rspec spec/models
    bundle exec rspec spec/requests
    bundle exec rspec spec/services
    bundle exec rspec spec/tasks
```

**Nota:** Os arquivos presentes na pasta ```spec/factories``` são responsáveis por gerar dados fictícios para o banco de teste.


### Executando testes no FrontEnd

Para a execução dos testes, navege até a raiz do projeto e execute os seguintes comandos:

```bash
    cd ceap-frontend
    npm test
```

Ao realizar o último comando, será executado todos os testes disponíveis para a aplicação. Por convenção, não existe uma pasta específica para se gravar os testes, mas normalmente são gravados dentro da pasta ```__tests__``` além de utilizar a extensão ```.test.jsx```. Também é possível executar testes pelas pastas, conforme exemplo abaixo:

```bash
    npm test -- src/components
    npm test -- src/pages/__tests__/Home.test.jsx
```

Nos exemplos acima, será executado todos os testes dentro da pasta ```src/components``` ou todos os testes do arquivo ```__tests__/Home.test.jsx```, respectivamente.
## Populando o Banco de Dados

Para popularmos o banco, podemos fazer de algumas formas diferentes. Primeiramente, podemos realizar a importação pelo ```rails console```. Basta seguir os comandos abaixo, desde a raiz do projeto:

```bash
    cd ceap-backend
    rails console
    ImportCsv.call("Caminho/para/arquivo.csv")
```

Já existe um arquivo ```public/Ano-2024-exemplo.csv``` de exemplo para que possa ser feito uma primeira importação. A segunta forma seria a importação por meio do rake task. Para isso, basta rodar uma das seguintes linhas de comando:

```bash
    rake import:arquivo_csv FILE=public/Ano-2024-exemplo.csv
    rake "import:arquivo_csv[public/Ano-2024-exemplo.csv]"
```

A terceira opção, seria a importação direto pelo sistema. Para isso, basta iniciar os servidores back e frontend. Com isso, acesse o sistema pelo link ```http://localhost:5173``` e em seguida vá até Importar CSV no canto superior esquerdo. Selecione o arquivo CSV correspondente e inicie a importação. Lembre-se que caso queira baixr o arquivo completo, basta acessar este [link](https://dadosabertos.camara.leg.br/swagger/api.html?tab=staticfile#staticfile) aqui.
## Stack utilizada

Por se tratar de um projeto que contém uma API no backend e um Front end separado, foram usadas diversas tecnologias, das quais irei pontuar as principais logo abaixo:

**Back-end:**
- Ruby versão 3.0.0
- Rails versão 7.1.5.1
- Gems em destaque:
  - RSpec para testes claros (```describe/it```) no BackEnd 
  - FactoryBot facilita factories legíveis para testes nas models, evitando fixtures verbosas
  - Shoulda-Matchers para complementar RSpec, com seus matcher prontos (```validate_presence_of``` ou até mesmo ```belongs_to```) acelera o processo de testes de validação e associações

**Front-End**
- React facilitando o gerenciamento de estado e composição via hooks, Vite sendo um build tool moderno, entregando hot-reload ultrarrápidos e bundles otimozados para Produção.
- React Routes para navegação simples e hooks específicos
- Axios para simplificação das chamadas à API, mantendo componentes desacoplados
- CSS Modules para estilização sem frameworks pesados e evitando colisões globais
- Jest + React Testing Library para testes da UI, garantindo um comportamento esperado

**Banco de Dados:** 
- PostgreSQL versão 16
- PgAdmin4 para manipulação dos dados diretamente no banco

**Ferramentas de Testes/Validação**
- BackEnd: RSpec
- FrontEnd: Jest e React Testing Library
- Testes na API: Insomnia

## Aprendizados

Embora desenvolvido em 'pouco tempo', tive a oportunidade de me desafiar bastante, principalmente no frontend. A muito tempo não mexia efetivamente com UI e me pus a prova neste desafio, um dos exemplos foi certamente a paginação pelo lado do Frontend. Embora o Rails tenha Gems que facilitem a paginação do JSON com algumas linhas de comando (como a Gem ```kaminari```), realizar o trabalho de paginação no front me fez rever conceitos que não lembrava, assim como trabalhar com CSS Modules, permitindo uma maior manipulação dos estilos, devido arquivos individuais de estilização.

Colocar a mão na massa no front me fez ver um lado que a tempos não via. Ainda tenho uma facilidade com o BackEnd e a regra de negócio, mas ver telas sendo formadas por meio das ~várias~ linhas de códigos e estilizações me faz querer descobrir mais deste mundo.
# Piano Virtual 2.0

Piano virtual responsivo desenvolvido com HTML, CSS e JavaScript puro. A aplicação permite tocar notas pelo teclado, mouse ou toque, reproduzir músicas, controlar o volume e gravar sequências próprias.

## Funcionalidades

- Reprodução com mouse, toque e teclado físico
- Áudios simultâneos, sem cortar a nota anterior
- Destaque visual das teclas pressionadas
- Controle de volume
- Exibição opcional dos atalhos
- Reprodução, pausa e parada de músicas
- Barra de progresso
- Gravação e reprodução de sequências
- Interface responsiva e acessível
- Código modular, sem frameworks

## Estrutura

```text
piano-virtual-music/
├── index.html
├── README.md
└── src/
    ├── scripts/
    │   ├── app.js
    │   ├── audio.js
    │   └── config.js
    ├── styles/
    │   ├── main.css
    │   └── reset.css
    └── tunes/
        └── arquivos .wav existentes
```

## Como executar

1. Clone o repositório.
2. Abra a pasta no Visual Studio Code.
3. Use a extensão Live Server.
4. Abra `index.html` com o Live Server.

Também é possível abrir o `index.html` diretamente, mas um servidor local evita limitações de carregamento em alguns navegadores.

## Teclas

`A W S E D F T G Y H U J K O L P ;`

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Web Audio via `HTMLAudioElement`

## Próximas melhorias

- Modo de aprendizagem com validação de notas
- Salvamento de gravações no navegador
- Mais músicas
- Temas visuais
- Testes automatizados

## Autor

Desenvolvido por Guilherme Junior.

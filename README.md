# Barbearia Veloso

Site institucional em HTML5, CSS3 e JavaScript puro para apresentação da Barbearia Veloso em Bom Retiro, Santa Catarina.

## Observações importantes

- O número de WhatsApp foi configurado inicialmente com `5549999521602`, conforme a orientação do briefing. Essa função precisa ser validada antes da publicação, para confirmar se o contato recebe mensagens por esse canal.
- Os textos, estrutura e proposta visual foram desenvolvidos originalmente para a Veloso, sem copiar marcas, textos ou layout de competidores.
- A página foi construída com foco em acessibilidade, navegação por teclado, menu móvel, modal de galeria e integração com WhatsApp e rota do Google Maps.

## Imagens e licença

As imagens da galeria e do destaque visual são ilustrativas e foram obtidas de bancos com uso compatível para apresentação web: Unsplash.

- Fonte: Unsplash (imagens de livre uso para fins de visualização e conteúdo editorial, conforme termos do provedor)
- Uso neste projeto: somente como imagens ilustrativas de cortes e ambiente de barbearia
- Observação: as imagens não representam clientes, funcionários, fachada ou ambiente da Barbearia Veloso sem autorização específica.

## Informações da empresa

- Nome: Barbearia Veloso
- Endereço: Av. 24 de Outubro, 560 - Centro, Bom Retiro - SC
- CEP: 88680-000
- Telefone público: (49) 99952-1602
- Telefone para ligação: +5549999521602
- Horários consultados em 06/11/2026:
  - Segunda a sexta: 08h às 19h
  - Sábado: 08h às 12h
  - Domingo: fechado
- Google Maps: https://www.google.com/maps/place/?q=place_id:ChIJRficnzNlIJURl33OWexMuJc

## Como executar

Abra o arquivo `index.html` diretamente no navegador ou sirva a pasta localmente com um servidor simples, como:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Personalização de preços

Os preços são centralizados em `config.js` para facilitar ajustes. O modo de demonstração está ativo por padrão (`demoMode: true`). Quando os valores forem confirmados pela barbearia, altere o valor para `false` e ajuste os preços em `services` conforme necessário.

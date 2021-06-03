const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log("Discord ON");

    getChannelIDs();
});

client.on('message', message => {
    if (message.content.toLowerCase().startsWith("bf-beatboxers")) { printaLista(); }

    if (message.content.toLowerCase().startsWith("bf-moeda")) { CaraCoroa(message); }

    console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
});

function CaraCoroa(message) {
    if (Math.floor(Math.random() * (2 - 1 + 1) + 1) % 2 == 0) {
        msg = ":coin: " + ConverteTextoEmoji("cara");
    } else {
        msg = ":coin: " + ConverteTextoEmoji("coroa");
    }
    msg = + "@" + message.author.username + "\r\n" + msg +
        EnviarMensagem(msg, message.channel.id)
}

function AbrirVotacao(tempo, canal) {
    direita = $("#direita").val() || ""
    esquerda = $("#esquerda").val() || ""
    meio = $("#meio").val() || ""

    tempo = tempo || 30

    canal = canal || $("#discord_canais").val() || "";

    var partes = [esquerda, meio, direita]

    esquerda = partes[0];

    direita = partes[partes.length - 1]

    if (partes.length != 3) {
        meio = "";
    }

    var txt = tempo + " segundos para Votacao\r\n \r\n \r\n"

    tempo = tempo + 5

    if (esquerda != "") {
        txt = txt + "🅰️" + ConverteTextoEmoji(" " + esquerda) + "\r\n \r\n"
    }

    if (meio != "") {
        txt = txt + "🅾️" + ConverteTextoEmoji(" " + meio) + "\r\n \r\n"
    }

    if (direita != "") {
        txt = txt + "🅱️" + ConverteTextoEmoji(" " + direita) + "\r\n \r\n"
    }

    EnviarMensagem(txt).then(function (message) {
        message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });

        if (esquerda != "") {
            message.react('🅰️')
        }

        if (meio != "") {
            message.react('🅾️')
        }

        if (direita != "") {
            message.react('🅱️')
        }

        const filter = (reaction, user) => {
            return (reaction.emoji.name == '🅰️' || reaction.emoji.name == '🅾️' || reaction.emoji.name == '🅱️')
        };

        message.awaitReactions(filter, { max: 99999, time: tempo * 1000 })
            .then(collected => {
                var contagem_A = -1
                var contagem_B = -1
                var contagem_O = -1

                console.log(collected)

                for (const reaction of collected) {
                    if (reaction._emoji.name === '🅰️') {
                        contagem_A = contagem_A + 1
                    }
                    if (reaction._emoji.name === '🅱️') {
                        contagem_B = contagem_B + 1
                    }
                    if (reaction._emoji.name === '🅾️') {
                        contagem_O = contagem_O + 1
                    }
                }

                var list = [];

                if (contagem_A > 1) {
                    list.push({ nome: esquerda, votos: contagem_A })
                }

                if (contagem_B > 1) {
                    list.push({ nome: direita, votos: contagem_B })
                }

                if (contagem_O > 1) {
                    list.push({ nome: meio, votos: contagem_O })
                }

                txt = "Fim da Votação:\r\n\r\n"

                list.sort((a, b) => (a.votos > b.votos) ? 1 : -1)

                var primeiro = list[0];
                list = list.filter(function (x) {
                    return x.votos = primeiro.votos
                });

                if (list.count == 1) {
                    txt = txt + "Vencedor: \r\n"

                    txt = txt + list[0].nome;
                } else {
                    txt = txt + "Segunda parte: " + list[0].nome + " " + list[1].nome;
                }

                EnviarMensagem(txt);

                message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: null });

                message.delete();
            })
            .catch(collected => {
                console.error(collected)
            });
    });
}

function printaLista() {
    var resp = ":microphone: =========== LISTA DE BEATBOXERS ===========  :microphone:\r\n"

    for (var i = 0; i < window.beatboxers_db.length; i++) {
        resp = resp + window.beatboxers_db[i].NomeArtistico + " / " + window.beatboxers_db[i].CidadeEstado + "\r\n"
    }
    resp = resp + "======================================================================"
    EnviarMensagem(resp)
}

function getChannelIDs(fetch) {
    try {
        let channels = client.channels.cache.array();
        for (const channel of channels) {
            if (channel.type == 'text')
                $("#discord_canais").append("<option value='" + channel.id + "'>" + channel.name + "</option>")
        }
    } catch (err) {
        console.log('array error')
        message.channel.send('An error occoured while getting the channels.')
        console.log(err)
    }
}

function EnviarMensagemEmoji(texto) {
    EnviarMensagem(ConverteTextoEmoji(texto))
}

function EnviarMensagem(texto, canal) {
    texto = texto || ""
    canal = canal || $("#discord_canais").val() || "";
    console.log(canal)
    if (canal != "" && texto != "")
        return client.channels.cache.get(canal).send(texto)
}

function ConverteTextoEmoji(texto) {
    var digitos = (texto + "").split("");
    for (var i = 0; i < digitos.length; i++) {
        switch (digitos[i]) {
            case "1":
                digitos[i] = ":one:"
                break;
            case "2":
                digitos[i] = ":two:"
                break;
            case "3":
                digitos[i] = ":three:"
                break;
            case "4":
                digitos[i] = ":four:"
                break;
            case "5":
                digitos[i] = ":five:"
                break;
            case "6":
                digitos[i] = ":six:"
                break;
            case "7":
                digitos[i] = ":seven:"
                break;
            case "8":
                digitos[i] = ":eight:"
                break;
            case "9":
                digitos[i] = ":nine:"
                break;
            case "0":
                digitos[i] = ":zero:"
                break;
            case " ":
                digitos[i] = ":black_small_square:"
                break;
            default:
                if (digitos[i].toLowerCase().length === 1 && digitos[i].toLowerCase().match(/[a-z]/i)) {
                    digitos[i] = ":regional_indicator_" + digitos[i].toLowerCase() + ":";
                }
                break;
        }
    }
    return digitos.join(" ")
}

var lasttime = 0;
function ColarTempo(tempo) {
    tempo = tempo || "NOPE";
    if (!isNaN(tempo)) {
        msg = "";
        tempo = parseInt(tempo)
        if (lasttime != tempo) {
            if (tempo == 0) {
                msg = ConverteTextoEmoji($("#message_end").val() || "tempo")
            } else {
                if (tempo % 30 == 0 || tempo == 15 || tempo == 10 || tempo == 5) {
                    msg = ConverteTextoEmoji(tempo + " segundos");
                }
            }
            EnviarMensagem(msg)
            lasttime = tempo
        }
    }
}

client.login(fs.readFileSync("./APP/discord.token"));
const PORT = process.env.PORT || 8000
const URL = "https://cinebaixtaquilla81.com/"
const IMDB_BASE_URL = "https://www.imdb.com"
const IMDB_FIND_URL = "https://www.imdb.com/find/"

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

app.get('/', (req, res) => {
    axios.get(URL)
        .then(response => {
            const movies = []
            const html = response.data
            const $ = cheerio.load(html)
          
            $('#formu_copias a .caja_copia2022').each( function () {
                const schedule = []

                const img = $(this).find('img').attr('src')
                const imgUrl = URL + img
                const title = $(this).find('.caja_datos_copia .copia_titulo').text().trim()
                const duration = $(this).find('.caja_datos_copia .copia_duracion').attr('value')
                const classification = $(this).find('.caja_datos_copia .copia_clasificine').text().trim()
                const rating = $(this).find('.caja_datos_copia .copia_cclasifi').attr('value')

                $(this).find(".caja_horarios_dia").each( function () {
                    const timetable = []

                    const day = $(this).find('.caja_dia .cdia_sesion').attr('value')
                    $(this).find('.sala_sesion').each(function (i) {
                        timetable[i] = {
                            room: $(this).attr('value'),
                            time: ''
                        }
                    })
                    $(this).find('.boton_hora').each(function (i) {
                        timetable[i].time = $(this).attr('value')
                    })

                    schedule.push({
                        day: day,
                        rooms: timetable
                    })
                })

                if (img !== undefined) {
                    movies.push({
                        title: title,
                        duration: duration.replace('Durada: ', '').replace(' min.', ''),
                        classification: classification.split('-')[0],
                        rating: rating.replace('Qualificació: ', '').replace('Anys', ''). trim(),
                        img: imgUrl,
                        schedule: schedule
                    })
                }
            })

            res.json(movies)
        })
})

app.get('/movies/:title/imdb', async (req, res) => {
    const title = req.params.title

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Referer': 'https://www.imdb.com/?ref_=nv_home',
        'Cookie': 'lc-main=es_ES;'
    }

    const findResponse = await axios.get(`${IMDB_FIND_URL}`,
        {
            params: {q: title},
            headers,
        },
    )
    let html = findResponse.data
    let $ = cheerio.load(html)
    const firstMovieUrl = $('section[data-testid="find-results-section-title"] .ipc-metadata-list-summary-item__t')
        .attr('href');

    const fullFirstMovieUrl = `${IMDB_BASE_URL}${firstMovieUrl}`
    const movieResponse = await axios.get(fullFirstMovieUrl, { headers })
    html = movieResponse.data
    $ = cheerio.load(html)
    const imdbRating = parseFloat(
        $('[data-testid="hero-rating-bar__aggregate-rating__score"] > span')
            .first()
            .text()
            .replace(',', '.')
    )
    const plot = $('[data-testid="plot-xl"]').text()

    const metadataLabels = $('.ipc-metadata-list .ipc-metadata-list-item__label')

    const directors = []
    metadataLabels
        .filter(function (){
            return $(this).text().trim() === "Dirección";
        })
        .next()
        .first()
        .each(function () {
            directors.push($(this).text())
        })

    const writers = []
    metadataLabels
        .filter(function (){
            return $(this).text().trim() === "Guión";
        })
        .next()
        .first()
        .find('.ipc-metadata-list-item__list-content-item')
        .each(function () {
             writers.push($(this).text())
        })

    const stars = []
    metadataLabels
        .filter(function (){
            return $(this).text().trim() === "Reparto principal";
        })
        .next()
        .first()
        .find('.ipc-metadata-list-item__list-content-item')
        .each(function () {
            stars.push($(this).text())
        })

    res.json({
        url: fullFirstMovieUrl,
        imdbRating,
        plot,
        directors,
        writers,
        stars
    })
})

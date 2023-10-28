import axios from "axios";
import cheerio from "cheerio";

const IMDB_BASE_URL = "https://www.imdb.com"
const IMDB_FIND_URL = "https://www.imdb.com/find/"

export default async function handler(request, response) {
    const title = request.query.title

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

    response.json({
        url: fullFirstMovieUrl,
        imdbRating,
        plot,
        directors,
        writers,
        stars
    })
}

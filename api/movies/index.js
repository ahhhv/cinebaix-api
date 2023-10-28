import axios from "axios";
import cheerio from "cheerio";

const URL = "https://cinebaixtaquilla81.com/"

export default async function handler(request, response) {
    const webResponse = await axios.get(URL)
    const movies = []
    const html = webResponse.data
    const $ = cheerio.load(html)

    $('#formu_copias a .caja_copia2022').each(function () {
        const schedule = []

        const img = $(this).find('img').attr('src')
        const imgUrl = URL + img
        const title = $(this).find('.caja_datos_copia .copia_titulo').text().trim()
        const duration = $(this).find('.caja_datos_copia .copia_duracion').attr('value')
        const classification = $(this).find('.caja_datos_copia .copia_clasificine').text().trim()
        const rating = $(this).find('.caja_datos_copia .copia_cclasifi').attr('value')

        $(this).find(".caja_horarios_dia").each(function () {
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
                rating: rating.replace('Qualificació: ', '').replace('Anys', '').trim(),
                img: imgUrl,
                schedule: schedule
            })
        }
    })

    response.status(200).json(movies)
}

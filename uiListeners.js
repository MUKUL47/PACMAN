loadGame = () => {
    let start = 3;
    $('.load-screen').show();
    (function loadCounter(){
        $('#load-msg').text(`Starting in ${start}${Array(start).fill('.').map(i => i).join('')}`)
        if(start === 0) {
            $('.load-screen').hide();
            loop()
            return
        }
        setTimeout(_ => {
            start -= 1
            loadCounter()
        }, 1000)
    }())
}
loadGame()

$('.restart-btn').click(_ => location.reload())
$('.pause-btn').click(_ => {
    if( $('.pause-btn').text().trim().toLowerCase() == 'pause'){
        noLoop()
        $('.pause-btn').text('Continue')
        return
    }
    loop()
    $('.pause-btn').text('Pause')
})

function updateFinalScore(score, lastedFor){
    $('#score').text(score)
    $('#lastedFor').text(lastedFor)
}


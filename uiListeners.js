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
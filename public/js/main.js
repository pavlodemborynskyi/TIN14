$(document).ready(()=>{
    $('.delete-genre').on('click',(e)=>{
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/genres/genre/' + id,
            success: (res)=>{
                window.location.href='/genres';
            },
            error: (err)=>{
                console.log(err);
            }
        })
    })
})
$(document).ready(()=>{
    $('.delete-film').on('click',(e)=>{
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/films/film/' + id,
            success: (res)=>{
                window.location.href='/films';
            },
            error: (err)=>{
                console.log(err);
            }
        })
    })
})
$(document).ready(()=>{
    $('.delete-cinemaHall').on('click',(e)=>{
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/cinemaHalls/cinemaHall/' + id,
            success: (res)=>{
                window.location.href='/cinemaHalls';
            },
            error: (err)=>{
                console.log(err);
            }
        })
    })
})
$(document).ready(()=>{
    $('.delete-performance').on('click',(e)=>{
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/performances/performance/' + id,
            success: (res)=>{
                window.location.href='/performances';
            },
            error: (err)=>{
                console.log(err);
            }
        })
    })
})
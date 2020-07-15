var loadData = function(){
    $('#booksList').empty();
    $('#bookEditSelect').empty().append('<option value=""> -- Select Book for edit --</option>');

    $.ajax({
        url:'../rest/rest.php/book',
        method:'GET',
        dateType:'json',
        data:{}
    }).done(function (response) {
        if (response.success !== undefined) {
            response.success.forEach(function (elem) {

                var bookOption = $('<option></option>');
                bookOption.text(elem.title);
                bookOption.val(elem.id);
                $('#bookEditSelect').append(bookOption);

                var pattern = $(document.querySelector('#bookPattern').cloneNode(true));
                pattern.removeAttr('style');
                pattern.find('.bookTitle').text(elem.title);
                pattern.find('button').data('id', elem.id);
                pattern.find('.book-description').text(elem.description);
                $('#booksList').append(pattern);
            });
        }
    }).fail(function (error) {
        console.log(error);
    });
}

$(document).ready(function () {

    loadData();

    $('#bookEdit').on('submit', function (event) {
        event.preventDefault();
        var id = $('#id').val();
        var title = $('#editTitle').val();
        var description = $('#editDescription').val();
        if (title.length > 3 && description.length > 3){
            $.ajax({
                url:'../rest/rest.php/book/' + id,
                method:'PATCH',
                dataType: 'json',
                data:{title:title,description:description}
            }).done(function (response) {
                if (response.success !== undefined){
                    loadData();
                    $('#id').val('');
                    $('#editTitle').val('');
                    $('#editDescription').val('');
                    showModal('Book successfully edited');
                }
            }).fail(function (error) {
                console.log(error);
            });
        }
    });

    $('#bookAdd').on('submit', function (event) {
        event.preventDefault();
        var title = $('#addTitle').val();
        var description = $('#addDescription').val();
        if (title.length > 3 && description.length > 3){
            $.ajax({
                url:'../rest/rest.php/book',
                method:'POST',
                dataType: 'json',
                data:{title:title,description:description}
            }).done(function (response) {
                if (response.success !== undefined){
                    loadData();
                    $('#addTitle').val('');
                    $('#addDescription').val('');
                    showModal('Book successfully added')
                }
            }).fail(function (error) {
                console.log(error);
            });
        }
    });

    $('#booksList').on('click', '.btn-book-remove', function (event) {
        var id = $(this).data('id');
        if (!isNaN(id)){
            $.ajax({
                url:'../rest/rest.php/book/' + id,
                method: 'delete',
                dataType: 'json',
                data: {}
            }).done(function (response) {
                if (response.success !== undefined){
                    console.log('book deleted');
                    loadData();
                }

            }).fail(function (error) {
                console.log(error);
            });
            $('#bookEdit').show();
        }

    })

    $('#bookEditSelect').on('change', function (event) {
        if (!isNaN($(this).val())){
            $.ajax({
                url:'../rest/rest.php/book/' + $(this).val(),
                method: 'GET',
                dataType: 'json',
                data: {}
            }).done(function (response) {
                if (response.success !== undefined){
                    var book = response.success[0];
                    $('#id').val(book.id);
                    $('#editTitle').val(book.title);
                    $('#editDescription').val(book.description);
                }

            }).fail(function (error) {
                console.log(error);
            });
            $('#bookEdit').show();
        }
    });

    $('#booksList').on('click','.btn-book-show-description', function (event) {
        var target = $(this).parent().next();
        if (target.is(':visible')){
            target.hide();
        }else {
            target.show();
        }
    });


});
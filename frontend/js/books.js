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

                 var bookPattern = $(document.querySelector('#bookPattern').cloneNode(true));
                 bookPattern.removeAttr('style');
                 bookPattern.find('.bookTitle').text(elem.title);
                 bookPattern.find('button').data('id', elem.id);
                 bookPattern.find('.book-description').text(elem.description);
                 $('#booksList').append(bookPattern);

            });
        }
    }).fail(function (error) {
        showModal('Error');
        console.log(error);
    });
}

var loadAuthors = function () {
    $('#author_id').empty().append('<option value=""> -- Select Author --</option>');

    $.ajax({
        url:'../rest/rest.php/author',
        method:'get',
        dataType:'json',
        data:{}
    }).done(function (response) {
        console.log(response);
        if (response.success !== undefined){
            response.success.forEach(function (elem) {

                var authorOption = $('<option></option>');
                authorOption.val(elem.id);
                authorOption.text(elem.name + ' ' + elem.surname);

                $('#author_id').append(authorOption);

            });
        }
    }).fail(function (error) {
        showModal('Error');
        console.log(error);
    });

}

var loadAuthorsByBookId = function(){

    $('#author_id').empty().append('<option value=""> -- Select Author --</option>');

    $.ajax({
        url:'../rest/rest.php/author',
        method:'get',
        dataType:'json',
        data:{}
    }).done(function (response) {
        console.log(response);
        if (response.success !== undefined){
            response.success.forEach(function (elem) {

                var authorOption = $('<option></option>');
                authorOption.val(elem.id);
                authorOption.text(elem.name + ' ' + elem.surname);

                $('#author_id_edit').append(authorOption);
            });
        }
    }).fail(function (error) {
        showModal('Error');
        console.log(error);
    });
}

$(document).ready(function () {

    loadData();
    loadAuthors();
    loadAuthorsByBookId();

    $('#bookEdit').on('submit',function (event) {
        event.preventDefault();
        var id = $('#id').val();
        var title = $('#editTitle').val();
        var description = $('#editDescription').val();
        var author_id = $('#author_id_edit').val();

        if (title.length > 3 && description.length > 3){
            $.ajax({
                url:'../rest/rest.php/book/' + id,
                method:'PATCH',
                dataType: 'json',
                data:{title:title,description:description,author_id:author_id}

            }).done(function (response) {
                if (response.success !== undefined){
                    loadData();
                    $('#id').val('');
                    $('#editTitle').val('');
                    $('#editDescription').val('');
                    showModal('Book successfully edited');
                    $('#bookEdit').hide();
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });
        }
    });

    $('#bookAdd').on('submit', function (event) {
        event.preventDefault();
        var title = $('#addTitle').val();
        var description = $('#addDescription').val();
        var author = $('#author_id').val();

        if (title.length > 3 && description.length > 3){
            $.ajax({
                url:'../rest/rest.php/book',
                method:'POST',
                dataType: 'json',
                data:{title:title,description:description,author_id:author}
            }).done(function (response) {
                if (response.success !== undefined){
                    loadData();
                    $('#addTitle').val('');
                    $('#addDescription').val('');
                    $('#author_id').val('');

                    showModal('Book successfully added')
                }
            }).fail(function (error) {
                showModal('Error');
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
                    loadData();
                    showModal('Book deleted');
                }
            }).fail(function (error) {
                showModal('Error');
            });
            $('#bookEdit').show();
        }
    });

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
                    $('#author_id_edit').val(book.author_id);
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });
            $('#bookEdit').show();
        }
    });

     $('#booksList').on('click','.btn-book-show-description', function (event) {
         var target = $(this).parent().next();
         console.log(target);
         if (target.is(':visible')){
             target.hide();
         }else {
             target.show();
         }
     });
});
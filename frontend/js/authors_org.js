var loadAuthors = function(){
    $('#authorsList').empty();
    $('#authorEditSelect').empty().append('<option value=""> -- Select Author for edit --</option>');

    $.ajax({
        url:'../rest/rest.php/author',
        method:'get',
        dataType:'json',
        data:{}
    }).done(function (response) {
        if (response.success !== undefined){
            response.success.forEach(function (elem) {

                var authorOption = $('<option></option>');
                authorOption.val(elem.id);
                authorOption.text(elem.name + ' ' + elem.surname);
                $('#authorEditSelect').append(authorOption);

                var authorPattern = $(document.querySelector('#authorPattern').cloneNode(true));
                authorPattern.removeAttr('style');
                authorPattern.find('.authorTitle').text(elem.name + ' ' + elem.surname);
                authorPattern.find('button').data('id', elem.id);

                $('#authorsList').append(authorPattern);
            });
        }
    }).fail(function (error) {
        showModal('Error');
        console.log(error);
    });
}

$(document).ready(function () {

    loadAuthors();

    $('#authorEdit').on('submit',function (event) {
        event.preventDefault();
        var id = $('#id').val();
        var name = $('#editName').val();
        var surname = $('#editSurname').val();
        if (name.length >= 3 && surname.length >= 3){
            $.ajax({
                url:'../rest/rest.php/author/' + id,
                method:'PATCH',
                dataType:'json',
                data:{name:name,surname:surname}
            }).done(function (response) {
                if (response !== undefined){
                    loadAuthors();
                    $('#id').val('');
                    $('#editName').val('');
                    $('#editSurname').val('');
                    showModal('Author successfully edited');
                    $('#authorEdit').hide();
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });
        }
    });

    $('#authorAdd').on('submit', function (event) {
        event.preventDefault();
        var name = $('#addName').val();
        var surname = $('#addSurname').val();
        if (name.length > 3 && surname.length > 3){
            $.ajax({
                url:'../rest/rest.php/author',
                method:'post',
                dataType:'json',
                data:{name:name, surname:surname}
            }).done(function (response) {
                if (response.success !== undefined){
                    loadAuthors();
                    $('#addName').val('');
                    $('#addSurname').val('');
                    showModal('Author added successfully');
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });
        }
    });

    $('#authorsList').on('click', '.btn-author-remove', function (event) {
        var id = $(this).data('id');
        if (!isNaN(id)){
            $.ajax({
                url:'../rest/rest.php/author/' + id,
                method:'delete',
                dataType:'json',
                data:{}
            }).done(function (response) {
                if (response.success !== undefined){
                    loadAuthors();
                    showModal('Author deleted');
                }
            }).fail(function (error) {
                showModal('Error');
            });
            $('#authorEdit').show();
        }
    });

    $('#authorEditSelect').on('change', function (event) {
        if (!isNaN($(this).val())){
            $.ajax({
                url: '../rest/rest.php/author/' + $(this).val(),
                method: 'GET',
                dataType: 'json',
                data:{}
            }).done(function (response) {
                if (response.success !== undefined) {
                    var author = response.success[0];
                    $('#editName').val(author.name);
                    $('#editSurname').val(author.surname);
                    $('#id').val(author.id);
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });
            $('#authorEdit').show();
        }
    });

    $('#authorsList').on('click','.btn-author-books', function (event) {

        var id = $(this).data('id');

        var target = $(this).parent().next();

        if (target.is(':visible')){
            target.hide();
            target.find('#bookEditSelect').parent().next().hide();
        }else {
            target.show();

            $.ajax({
                url:'../rest/rest.php/book',
                method:'get',
                dataType:'json',
                data:{}
            }).done(function (response) {
                target.find('#bookEditSelect').empty().append('<option>-- Select Book --</option>');
                if (response.success !== undefined){
                    response.success.forEach(function (elem) {
                        var authorId = elem.author_id;

                        if (id === authorId){

                            var bookOption = $('<option></option>');
                            bookOption.val(elem.id);
                            bookOption.text(elem.title);
                            target.find('#bookEditSelect').append(bookOption);



                        }
                    });
                }
            }).fail(function (error) {
                showModal('Error');
                console.log(error);
            });


        }

        $('#authorsList').on('change','#bookEditSelect', function (event) {

            if (!isNaN($(this).val())){
                $.ajax({
                    url: '../rest/rest.php/book/' + $(this).val(),
                    method: 'GET',
                    dataType: 'json',
                    data:{}
                }).done(function (response) {
                    if (response.success !== undefined) {
                        console.log(response.success);
                        response.success.forEach(function (elem) {
                            var bookDescription = $('<span></span>');
                            bookDescription.text(elem.description);
                            var desc = target.find('#bookEditSelect').parent().next();
                            desc.empty().append(bookDescription);

                        });
                        $('.book-description').show();

                    }
                }).fail(function (error) {
                    showModal('Error');
                    console.log(error);
                });
                // $('#authorEdit').show();

            }
        });
    });


});
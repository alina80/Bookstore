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
        if (name.length > 3 && surname.length > 3){
            $.ajax({
                url:'../rest/rest.php/author/' + id,
                method:'patch',
                dataType:'json',
                data:{name:name,surname:surname}
            }).done(function (response) {
                if (response !== undefined){
                    console.log('Edited successfully');
                    loadAuthors();
                    $('#id').val('');
                    $('#editName').val('');
                    $('#editSurname').val('');
                }
            });
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
                if (response.success !== undefined){
                    console.log(response);
                    var author = response.success[0];

                    $('#editName').val(author.name);
                    $('#editSurname').val(author.surname);
                    $('#id').val(author.id);
                }


            }).fail(function (error) {
                console.log(error);
            });
            $('#authorEdit').show();
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
                    console.log('Author added successfully');
                    loadAuthors();
                    $('#addName').val('');
                    $('#addSurname').val('');
                }
            }).fail(function (error) {
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
            }).do
        }

    })
})
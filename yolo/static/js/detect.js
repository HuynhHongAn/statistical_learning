function readURL(input) {
    if (input.files && input.files[0]) {
        $(".alert").remove()

        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image-preview')
                .attr('src', "")
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    } else {

    }
}

function getAlertMessage(type, message) {
    const id = Math.floor(Math.random() * 10000) + 1
    switch (type) {
        case "success":
            return `
				<div id="${id}" class="alert alert-success alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					${message}
				</div>
			`
        case "error":
            return `
				 <div id="${id}" class="alert alert-danger alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					${message}
				</div>
			`
    }
}

function appendAlert(alertContainer, alertComponent) {
    const el = $(alertComponent)
    alertContainer.append(el)

    setTimeout(function (){
        el.fadeOut(500)
    }, 5000)
}

$(document).ready(function () {
    setInterval(function (){
        var alerts =
        $(".alert").last().fadeOut(500)
    }, 5000)
    $("#detect-form").submit(function (e) {
        e.preventDefault();

        const form = $(this);
        const url = form.attr('action');
        const alertContainer = $("#alert-container")

        let fd = new FormData(document.getElementById("detect-form"));
        let files = $('#image-input')[0].files[0];
        fd.append('file', files);

        $.ajax({
            type: "POST",
            url: url,
            data: fd,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.error_message) {
                    appendAlert(alertContainer, getAlertMessage("error", data.error_message))
                } else {
                    appendAlert(alertContainer, getAlertMessage("success", "Successfully detect image"))
                    $('#image-preview').attr('src', data.uploaded_file_url + "?ver=" + Date.now())

                    $("div#more table tbody").empty()
                    $.each(data.extra_info, function (description, info) {
                        $("div#more table tbody").append(`
                             <tr>
                                <td>${description}</td>
                                <td>${info}</td>
                            </tr>
                        `)
                    })
                }
            },
            error: function (e) {
                appendAlert(alertContainer, getAlertMessage("error", e.message))
            }
        });
    });
});


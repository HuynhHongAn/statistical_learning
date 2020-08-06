function readURL(input) {
    if (input.files && input.files[0]) {
        $(".alert").remove()

        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image-preview')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    } else {

    }
}

function getAlertMessage(type, message) {
    switch (type) {
        case "success":
            return `
				<div class="alert alert-success alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					<strong>Successfully</strong> ${message}
				</div>
			`
        case "error":
            return `
				 <div class="alert alert-danger alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					<strong>Error</strong> ${message}
				</div>
			`
    }
}

function appendAlert(alertContainer, alertComponent) {
    alertContainer.append(alertComponent)

    setTimeout(function (){
        $(".alert").last().blur(500)
    }, 5000)
}

$(document).ready(function () {
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
                    appendAlert(alertContainer, getAlertMessage("success", "detect image"))
                    $('#image-preview').attr('src', data.uploaded_file_url)
                }
            },
            error: function (e) {
                appendAlert(alertContainer, getAlertMessage("error", e.message))
            }
        });
    });
});


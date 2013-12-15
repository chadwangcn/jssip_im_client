var userLocalIP = "192.168.1.104";

$(document).ready(function () {

    // Default settings.
    //var default_sip_uri = "jmillan@jssip.net";
    //var default_sip_password = '';
    //var outbound_proxy_set = 'ws://tryit.jssip.net:10080';

    outbound_proxy_set = "wss://" + userLocalIP + ":7443"
    $("#ws_uri").val(outbound_proxy_set);

    $("#webcam").draggable();
    $("#sponsor").draggable();
    $("#div_userListDlg").draggable();

    // Global variables.
    PageTitle = "Chad Version FreeSWITCH WebRTC Portal";
    document.title = PageTitle;

    $("#version .jssip-version").text("JsSIP version:  " + JsSIP.version());
    $("#version").show();

    sip_uri = default_sip_uri;
    sip_password = default_sip_password;

    login_button = $("#login_button");
    login_inputs = $("#login-box input");
    login_sip_uri = $("#login-box input#sip_uri");
    login_sip_password = $("#login-box input#sip_password");
    login_ws_uri = $("#login-box input#ws_uri");

    register_checkbox = $("#phone > .status #register");

    phone_dialed_number_screen = $("#phone > .controls  input.destination");

    phone_call_button = $("#phone > .controls > .dialbox > .dial-buttons > .call");

    phone_chat_button = $("#phone > .controls > .dialbox > .dial-buttons > .chat");

    phone_test_button = $("#phone > .controls > .dialbox > .dial-buttons > .test");

    phone_mute_button = $("#phone > .controls > .dialbox > .dial-buttons > .mute");

    phone_dialpad_button = $("#phone > .controls > .dialpad .button");

    soundPlayer = document.createElement("audio");
    soundPlayer.volume = 1;


    // Local variables.
    var theme01 = $("#themes > div.theme01");
    var theme02 = $("#themes > div.theme02");
    var theme03 = $("#themes > div.theme03");
    var theme04 = $("#themes > div.theme04");
    var theme05 = $("#themes > div.theme05");


    // Initialization.
    $("#login-page").height($(window).height());
    $("#login-page").width($(window).width());

    $(window).resize(function (event) {
        $("#login-page").height($(window).height());
        $("#login-page").width($(window).width());
    });

    login_inputs.focus(function () {
        if ($(this).hasClass("unset")) {
            $(this).val("");
            $(this).removeClass("unset");
        }
    });

    login_sip_uri.blur(function () {
        if ($(this).val() == "") {
            $(this).addClass("unset");
            $(this).val("SIP username");
        }
    });

    login_sip_password.blur(function () {
        if ($(this).val() == "") {
            $(this).addClass("unset");
            $(this).val("SIP password");
        }
    });

    login_ws_uri.blur(function () {
        if ($(this).val() == "") {
            $(this).addClass("unset");
            $(this).val("WS URI (i.e: wss://example.net)");
        }
    });

    $('#sip_uri').focus();


    function do_sub(go) {

        if (login_sip_uri.val() != "" && !login_sip_uri.hasClass("unset"))
            sip_uri = login_sip_uri.val();
        if (login_sip_password.val() != "" && !login_sip_password.hasClass("unset"))
            sip_password = login_sip_password.val();
        if (login_ws_uri.val() != "" && !login_ws_uri.hasClass("unset")) {
            ws_uri = login_ws_uri.val();
            outbound_proxy_set = ws_uri;
        }


        if (sip_uri == "") {
            alert("Please enter your name!");
            return;
        }
        else if (sip_password == null) {
            alert("Please fill SIP password field");
            return;
        }
        else if (ws_uri == null) {
            alert("Please fill WS URI field");
            return;
        }


        short_sip_uri = sip_uri;
        sip_uri = short_sip_uri.replace(" ", "%20") + "@" + userLocalIP;
        phone_init();
    }


    function hashstr(hup) {
        if (window.location.hash) {
            console.log(window.location.hash);
            var ext = window.location.hash.substring(1);
            if (ext) {
                var x = ext.split("!");
                console.log(x);

                phone_dialed_number_screen.val(x[0]);
                if (x[1]) {
                    $("#sip_uri").val(x[1].replace("+", " "));
                }
                do_sub();
                window.setTimeout(GUI.phoneCallButtonPressed, 1000);
            }
        }
    }

    hashstr();

    //$(window).bind( 'hashchange', function(e) { window.reload(); });



    login_inputs.keypress(function (e) {
        // Enter pressed?.
        if (e.which == 13) {
            do_sub();
        }
    });

    login_button.click(function (event) { do_sub(); });

    theme01.click(function (event) {
        $("body").removeClass();
        $("body").addClass("bg01");
    });

    theme02.click(function (event) {
        $("body").removeClass();
        $("body").addClass("bg02");
    });

    theme03.click(function (event) {
        $("body").removeClass();
        $("body").addClass("bg03");
    });

    theme04.click(function (event) {
        $("body").removeClass();
        $("body").addClass("bg04");
    });

    theme05.click(function (event) {
        $("body").removeClass();
        $("body").addClass("bg05");
    });

    register_checkbox.change(function (event) {
        if ($(this).is(":checked")) {
            console.warn("register_checkbox has been checked");
            // Don't change current status for now. Registration callbacks will do it.
            register_checkbox.attr("checked", false);
            // Avoid new change until the registration action ends.
            register_checkbox.attr("disabled", true);
            MyPhone.register();
        }
        else {
            console.warn("register_checkbox has been unchecked");
            // Don't change current status for now. Registration callbacks will do it.
            register_checkbox.attr("checked", true);
            // Avoid new change until the registration action ends.
            register_checkbox.attr("disabled", true);
            MyPhone.unregister();
        }
    });

    // NOTE: Para hacer unregister_all (esquina arriba-dcha un cuadro
    // transparente de 20 x 20 px.
    $("#unregister_all").click(function () {
        MyPhone.unregister('all');
    });

    // NOTE: Para desconectarse/conectarse al WebSocket.
    $("#ws_reconnect").click(function () {
        if (MyPhone.transport.connected)
            MyPhone.transport.disconnect();
        else
            MyPhone.transport.connect();
    });

    phone_call_button.click(function (event) {
        GUI.phoneCallButtonPressed();
    });

    phone_test_button.click(function (event) {
        var info = String("info test button push");
        //GUI.jssipCtrlInfo(info);
    });

    phone_mute_button.click(function (event) {
        var info = String("info mute button push");
        //GUI.jssipCtrlInfo(info);
    });

    phone_chat_button.click(function (event) {
        GUI.phoneChatButtonPressed();
    });

    phone_dialpad_button.click(function () {
        if ($(this).hasClass("digit-asterisk"))
            sound_file = "asterisk";
        else if ($(this).hasClass("digit-pound"))
            sound_file = "pound";
        else
            sound_file = $(this).text();
        soundPlayer.setAttribute("src", "sounds/dialpad/" + sound_file + ".ogg");
        soundPlayer.play();

        if (!GUI.jssipDTMF($(this).text())) {
            phone_dialed_number_screen.val(phone_dialed_number_screen.val() + $(this).text());
        }

        //phone_dialed_number_screen.focus();
    });

    phone_dialed_number_screen.keypress(function (e) {
        // Enter pressed? so Dial.
        if (e.which == 13)
            GUI.phoneCallButtonPressed();
    });


    function phone_init() {
        if (typeof (short_sip_uri) == "undefined") {
            console.log("typeof (short_sip_uri) == \"undefined\"");
            //alert("typeof (short_sip_uri) == \"undefined\"");
            return;
        }
        $("#phone > .status .user").text(short_sip_uri);
        $("#login-page").fadeOut(1000, function () {
            $(this).remove();
        });

        var configuration = {
            'outbound_proxy_set': [outbound_proxy_set],
            'uri': sip_uri,
            'display_name': '',
            'password': sip_password,
            'register_expires': 600,
            'secure_transport': false,
            //      'stun_server': 'aliax.net',
            'trace_sip': true,
            'hack_ip_in_contact': false,
            'hack_via_tcp': false
        };

        try {
            MyPhone = new JsSIP.UA(configuration);
        } catch (e) {
            console.log(e);
            return;
        }

        // Transport connection/disconnection callbacks
        MyPhone.on('connected', ws_connected);
        MyPhone.on('disconnected', ws_disconnected);

        // Call/Message reception callbacks
        MyPhone.on('newSession', function (e) {
            GUI.new_session(e)
        }
    );

        MyPhone.on('newMessage', function (e) {
            GUI.new_message(e)
        }
    );
        MyPhone.on('userEvent', function (e) {
            GUI.new_userEvent(e)
        }
    );
        // Registration/Deregistration callbacks
        MyPhone.on('registered', function (e) {
            console.info('Registered');
            GUI.setStatus("registered");
        }
    );

        MyPhone.on('unregistered', function (e) {
            console.info('Deregistered');
            GUI.setStatus("connected");
        }
    );

        MyPhone.on('registrationFailed', function (e) {
            console.info('Registration failure');
            GUI.setStatus("connected");
        }
    );

        // Start
        MyPhone.start();

        $('#phone .destination').focus();
        $('#phone .destination').val("4688");

    }

    function ws_connected(e) {
        document.title = PageTitle;
        GUI.setStatus("connected");
        // Habilitar el phone.
        $("#phone .controls .ws-disconnected").hide();
    };

    function ws_disconnected() {
        document.title = PageTitle;
        GUI.setStatus("disconnected");
        // Deshabilitar el phone.
        $("#phone .controls .ws-disconnected").show();
        // Eliminar todas las sessiones existentes.
        $("#sessions > .session").each(function (i, session) {
            GUI.removeSession(session, 500);
        });
    };

    // If data is already set (default values) then directly go.
    if (sip_uri && sip_password && ws_uri)
        phone_init();

});



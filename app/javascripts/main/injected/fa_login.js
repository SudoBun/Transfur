/* Remove extra login form text and move logo from footer */
var loginForm = $('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td > table');
var logo = $('.footer .falogo');
$('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td').empty().append(loginForm).prepend(logo);

/* Remove login form labels */
$('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1)').remove();

/* Add placeholders to login form */
$('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td > table > tbody > tr > td > input[type=text]').attr('placeholder', 'Username');
$('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td > table > tbody > tr > td > input[type=password]').attr('placeholder', 'Password');

/* Add cancel button to login form */
$('body > div > div > form > table.maintable > tbody > tr:nth-child(2) > td > table > tbody > tr > td > input[type=submit]').after('<input type="reset" class="button" value="Cancel" onclick="window.close()"/>');
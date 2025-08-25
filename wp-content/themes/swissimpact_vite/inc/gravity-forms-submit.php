<?php 
$consumer_key    = 'ck_b5170249830ac94170b8aef5abc4b23cb7ee7faa';
$consumer_secret = 'cs_44b61cb1eb23d450d47a88f5d792143b4f4f3bce';
$url             = 'https://gravityforms.local/wp-json/gf/v2/forms';
$method          = 'POST';
$args            = array();
 
// Use helper to get oAuth authentication parameters in URL.
// Download helper library from: https://s22280.pcdn.co/wp-content/uploads/2017/01/class-oauth-request.php_.zip
require_once( 'class-oauth-request.php' );
$oauth = new OAuth_Request( $url, $consumer_key, $consumer_secret, $method, $args );
 
// Form to be created.
$form = array( 'title' => 'Form title' );
 
// Send request.
$response = wp_remote_request( $oauth->get_url(),
    array(
        'method'  => $method,
        'body'    => json_encode( $form ),
        'headers' => array( 'Content-type' => 'application/json' ),
    )
);
 
// Check the response code.
if ( wp_remote_retrieve_response_code( $response ) != 200 || ( empty( wp_remote_retrieve_body( $response ) ) ) ) {
    // If not a 200, HTTP request failed.
    die( 'There was an error attempting to access the API.' );
}

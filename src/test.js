const fs = require( 'fs' )
const path = require( 'path' )

const https = require( 'https' )
const dasu = require( '/Users/mollie/code/dasu/dasu.js' )

const jp = require( 'jsonpath' )

const params = {}
params.host = 'youtube.com'
params.protocol = 'https:'
// params.port = 443
params.headers = {}

const text = fs.readFileSync( __dirname + '/request-sample.txt', 'utf8' )

const lines = text.split( '\n' )

// transform params
for ( let i = 0; i < lines.length; i++ ) {
  let line = lines[ i ]

  const isHeader = ( line[ 0 ] !== ':' )

  // cut off leading ':'
  if ( !isHeader ) line = line.slice( 1 )

  console.log( line )

  // normalize key-value pair
  const kv = line.split( ':' )

  if ( !kv[ 1 ] ) continue

  const key = kv.shift().trim().toLowerCase()
  const value = kv.join( ':' ).trim()

  if ( !isHeader ) {
    // params
    params[ key ] = value
  } else {
    // header
    params.headers[ key ] = value
  }
}

console.log( params )

params.data = ''

return dasu.req( params, function ( err, res, body ) {
  if ( err ) throw err

  console.log( 'status: ' + res.statusCode )

  console.log( res.headers )

  fs.writeFileSync( './res.json', body, 'binary' )

  const json = JSON.parse( body )

  /// videoRenderer's
  const items = jp.query( json, '$..videoRenderer' )

  console.log( 'items.length: ' + items.length )

  items.forEach( function ( item ) {
    const vr = item

    if ( !vr ) {
      // maybe playlistRenderer
      return
    }

    const videoId = vr.videoId
    const title = vr.title.runs[ 0 ].text

    console.log( `${ videoId } ${ title }` )
  } )
} )

const req = https.request( params, function ( res ) {
  console.log( 'status: ' + res.statusCode )

  console.log( res.headers )
} )

req.on( 'error', function ( err ) {
  throw err
} )


const data = 'session_token=QUFFLUhqbjdkSFIzR2wweVowSmI5b2pVb3pSaFZMSnI2Z3xBQ3Jtc0tuSkluMGJuMmNuRF9PTjBsZXlYal9vVXV3SV9jZENIb2Y4SGh6VVp5eHgyQWkzVldfQmphVVBmcW1GOURyTlNKcGVaaGFYdjExWTFIel8tUWVOSVBwQldVVC1rVHhycktPUzNnZTlPN0FVcXExS0dtQzM3cnhDSFVyVUtWbDktR0pPZEphUGRiUWc1V2tPeGFCWlM1TFdiakd4T3c%3D'

req.end( data ) // sends request

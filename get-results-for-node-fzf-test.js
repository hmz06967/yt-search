const yts = require( './src/index.js' )

const opts = {
  search: 'rage against the machine',
  pageEnd: 3
}

yts( opts, function ( err, r ) {
  if ( err ) throw err

  r.videos.forEach( function ( video ) {
    const views = String( video.views ).padStart( 10, ' ' )
    const title = video.title
    const timestamp = video.timestamp
    const seconds = video.seconds
    console.log( `${ views } | ${ title } (${ timestamp }) | ${ video.author.name }` )
  } )
} )

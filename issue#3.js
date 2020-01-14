var yts = require( './src/index.js' )

var q = 'คุกกี้เสี่ยงทาย'

q = 'mobile test automation'
q = 'youtube premium ()'

// const querystring = require( 'querystring' )

const opts = {
  query: q,
  pageEnd: 2
}

search()

function search () {
  let stop = false

  yts( opts, function ( err, r ) {
    if ( err ) throw err

    // console.log( r )

    const videos = r.videos
    const playlists = r.playlists
    const accounts = r.accounts

    // console.log( accounts )
    // console.log( playlists )

    videos.forEach( function ( video ) {
      const id = video.videoId
      const title = video.title.slice( 0, 30 )
      console.log( `${ id }: ${ title }` )

      if ( id.length < 10 ) stop = true
    } )

    if ( !stop ) {
      setTimeout( search, 1000 )
    }
  } )
}


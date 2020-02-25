class MyUploadAdapter {
  constructor( loader ) {
    this.loader = loader;
    this.axios = window.$nuxt.$axios;
    this.url = '/api/upload-file';
  }
  upload(){
    return this.loader.file
      .then( file => new Promise( async ( resolve, reject ) => {
        let data = new FormData;
        data.append('file', file);
        let res = await this.axios.$post(this.url,data);
        resolve( {
          default: window.$nuxt.$axios.defaults.baseURL+res
        });
      } ) );
  }
}

function MyCustomUploadAdapterPlugin( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    return new MyUploadAdapter( loader );
  };
}

export default MyCustomUploadAdapterPlugin;

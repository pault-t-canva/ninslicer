import * as React from 'react';
import './App.css';

class App extends React.Component<{}, { imagePreviewUrl: string , slice: number[] }> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {
      imagePreviewUrl: "",
      slice:[]
    }
  }
  public render() {
    let { imagePreviewUrl } = this.state;
    const {slice} = this.state
    const svgEl = document.getElementById("App-Svg");

    let position = {
      height: 0,
      left: 0, 
      top: 400, 
      width: 0, 
    }
 
    if(svgEl) {
      position = svgEl.getBoundingClientRect()
    }

    if (!imagePreviewUrl) {
      imagePreviewUrl = ""
    }

    let svg;

    let width = 20;
    let height = 20;
    let x = 0;
    let y = 0;
    if (slice && slice.length === 4) {
      y = slice[0]
      x = slice[1]
      width = slice[2]
      height = slice[3]
      svg = <g>
          <rect width={x} height={height} x={0} y={y} fill="green"/>
          <rect width={width} height={height} x={x} y={y}/>

          <rect width={position.width - width - x} height={height} x={x + width} y={y} fill="green"/>

          <rect width={width} height={y} x={x} y={0} fill="blue"/>
          <rect width={width} height={position.height - height - y} x={x} y={y + height} fill="blue"/>
        </g>
    }
   let doc = <span></span>
    if(imagePreviewUrl.length > 0) {
      var parser = new DOMParser();
      let parsed = parser.parseFromString(imagePreviewUrl, "image/svg+xml")!!
      let child = parsed.firstElementChild!!
      let viewbox = child.attributes["viewBox"].value.split(' ')
      let res = child.outerHTML
      let width = viewbox[2] + "px"
      let height = viewbox[3] + "px"
      doc = <div><div id="App-Svg" style={{width: width, height: height, margin: "auto"}} dangerouslySetInnerHTML={{__html: res}}></div></div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Upload an SVG to test 9 slice</h1>
        </header>
        <p className="App-intro">
          To get started - upload an SVG
        </p>
        <form>
          <input type='text' onChange={this.handleSliceChange} placeholder='top,left,width,height as pixels'/>
          <input type='file' onChange={this.handleImageChange} />
        </form>
        {doc}
        <svg className="App-Svg-Overlay" style={{position: "absolute", top: position.top, left: position.left, opacity: 0.3, height: "100%", width: "100%"}}>
          <g>
            {svg}
          </g>
        </svg>
      </div>
    );
  }

  private handleSliceChange = (e: any): any => {
    this.setState({
      slice: e.target.value.split(',').map((x :string) => parseInt(x, 10))
    })
  }

  private handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): any => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files!![0];

    const imBadAtJS = this
    reader.onloadend = () => {
      const result = reader.result
      imBadAtJS.setState({
        imagePreviewUrl: result as string
      });
    }
    reader.readAsText(file)
  }
}

export default App;

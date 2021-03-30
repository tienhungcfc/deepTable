import { useState } from "react"

function Photo(props) {

    const [src, setSrc] = useState(props.value);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    var server = props.server || ''
    var folder = props.folder || '/Upload/image/';
    var api = props.api || server + '/api/v3/file?cmd=upload';

    var h = 64;

    function handleFile(e) {
        const files = e.target.files;
        const formData = new FormData();
        formData.append('file', files[0]);
        setLoading(true);
        fetch(api + "&prefix=" + (props.prefix || "upload"), {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(rt => {
                setSrc(rt.data);
                setLoading(false);
                props.onChange && props.onChange({ value: rt.data });
            }).catch(e => {
                setLoading(false);
            });
    }
    return (
        <div className="border d-inline-flex rounded overflow-hidden bg-light" style={{
            height: h,
            width: h * 1.5
        }}
        >
            {
                loading ?
                    (
                        <div className="d-flex align-items-center flex-grow-1 justify-content-center">
                            <div className="spinner-grow text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="d-flex flex-grow-1">
                            <div
                                className={!loaded ? "d-none" : "d-flex align-items-center  justify-content-center"}
                                style={{
                                    height: h,
                                    flex: '0 0 ' + h + 'px',
                                    width: h
                                }}>
                                <div className="">
                                    {
                                        src ? <img
                                            alt=""
                                            src={server + folder + src}
                                            onLoad={e => { setLoaded(true) }}
                                            onError={e => { setLoaded(false) }}
                                            style={{
                                                maxHeight: "96%",
                                                maxWidth: "96%",
                                                margin: 0
                                            }}
                                        ></img> : null
                                    }
                                </div>
                            </div>
                            <label className="d-flex align-items-center flex-grow-1 justify-content-center">
                                <span>
                                    <i className={loaded ? "fa fa-refresh" : "fa fa-upload"}></i>
                                    <input type="file" onChange={handleFile} className="d-none"></input>
                                </span>

                            </label>
                        </div>
                    )
            }


        </div>
    )
}

export { Photo }
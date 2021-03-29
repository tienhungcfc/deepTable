import React, {  useState } from 'react'
import AsyncSelect from 'react-select/async';

function get(url) {
    return fetch(url, {
        method: 'Get'
    }).then(rs => rs.json());
}

var inv = 0;


function Select2(props) {

  
    //const [key, setKey] = useState('');
    const [defaultValue, setDefaultValue] = useState({});
    const [first, setFirst] = useState(false);
    const api = props.api || (props.server || '') + '/api/gl/select2?cmd=' + props.cmd;

    function bind(arr, callback) {
        var a = [];
        arr.forEach(function (x) {
            a.push({
                label: x.text,
                value: x.id
            })
        })
        callback(a);
        
    }

    var ready = false;

    if(props.value && !first){
        get(api + '&selected=' + props.value).then(rs => {
            bind(rs.data, (a)=>{
                setDefaultValue(a[0]);
                setFirst(true);
            });
            
        });
       
    }else{
        ready = true;
    }


    const loadOptions = (inputValue, callback) => {
        clearTimeout(inv);
        inv = setTimeout(() => {
            
            get(api + '&key=' + inputValue.replace(/\W/g)).then(rs => {
                bind(rs.data, callback);
            });
        }, 300);
    };


    if(!ready){
        return "...."
    }
    return (
        <AsyncSelect
            loadOptions={loadOptions}
            defaultValue ={ defaultValue}
            defaultOptions
            //onInputChange={e => { setKey(e.replace(/\W/g, '')) }}
            onChange={e => props.onChange({ value: e.value, item: e })}
        />
    );
}
export { Select2 }
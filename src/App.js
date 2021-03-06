import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Demo } from './Common/Demo';
import { getScrollbarWidth } from './Common/Helper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { NavDropdown, Breadcrumb, Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import 'moment/locale/vi';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor2 from './Common/ClassicEditor2';
import { Photo } from './Common/Upload';
import { Select2 } from './Common/Select2';
import { fe, clone, _2, rawText } from './Common/Helper'
import Editor from "@monaco-editor/react";

function CreateDeep(fn) {
  var x = {
    title: 'Title 1',
    visibled: false,
    props: ['Title'],
    freeze: ['Title'],
    active: null,
    items: [],
    dictionary: {
      //prop:text
    },
    edit: {
      item: null,
      action: '',
      title: 'Chi tiết',
      props: [
        //{name, type,}
        { name: "Title", type: "text" }
      ],
      propsInDeep: [
        //{name, type,}
        { name: "Title", type: "text" }
      ],

    },
    newItem() {
      return {
        Title: '',
        ID: 0
      }
    },
    noDeep: false,
    onParent: () => { },
    resizes: {
      //cellName: zise
      ID: 75
    },
    pgs: {
      total: 0,
      pi: 1,
      ps: 100,
      pcount: 0
    },
    server: {
      update: '',
      delete: '',
      get: ''
    },
    filter: [
      { name: "key", value: "", text: "Từ khóa" },
      { name: "from", value: "", type: "datetime", text: "Từ ngày" },
      { name: "to", value: "", type: "datetime", text: "Đến ngày" }
    ],
    filterInDeep: [
      { name: "key", value: "", text: "Từ khóa" },
      { name: "from", value: "", type: "datetime", text: "Từ ngày" },
      { name: "to", value: "", type: "datetime", text: "Đến ngày" }
    ],
    onParentSet(pr, adj) {
      //tùy biến ở đây khi cài đặt

      // pr 
      //adj: {name:load, value:filter} | {name:'edit', value: _edit}
      //gọi trong hàm loadData(),doUpdate()

    },
    cellRenders: {
      //cellName: fn
    }
  };

  if (fn) fn(x);
  return x;
}

var data = {
  loadingText: '',
  server: '',
  delay: 500,
  Deeps: [
    CreateDeep(),
    CreateDeep(),
    CreateDeep()
  ],
  Env: {
    width: 250,
    ScrollbarWidth: getScrollbarWidth(),
    contentHeight: 0.8 * window.innerHeight,
    cellHeight: 36,
    cellWidth: 250,
    fullInput:{
      head: "0 0 32px",
      monacoHeight: "calc(100vh - 64px)"
    }
  },
  firstLoad: false

}


if (window.location.href.indexOf('localhost:3000') > -1)
  Demo(data);

if (window.top.DeepTableCreator) window.top.DeepTableCreator(data, { CreateDeep: CreateDeep });

function ParentInvoke(deep, objToAdj) {
  var deepIndex = data.Deeps.indexOf(deep);
  var a = (data.Deeps[deepIndex - 1] || {}).active || {};
  deep.onParentSet(a, objToAdj)
}

function getCellWidth(deep, cellName) {
  var w = deep.resizes[cellName];
  if (w) {
    return Math.max(w, 50);
  }
  w = data.Env.cellWidth;
  switch (cellName) {
    case '--':
      w = 150;
      break;
    case '-STT-':
      w = 50;
      break;
    default:
      break;
  }
  return w;
}
function Cell(props) {

  var deep = props.deep;

  function render() {
    return props.rawText ? props.rawText :
      props.action ? props.action :
        deep.cellRenders[props.cellName] ? deep.cellRenders[props.cellName](props.text) :
          (<div className={"text-truncate"} dangerouslySetInnerHTML={{ __html: rawText(props.text) }}>
          </div>)
  }

  return (
    <div
      className={"dtb-prop dtb-cell d-flex px-3 border border-top-0 border-start-0"
        + (props.head ? " dtb-head " : "")
        + (props.first > 0 ? " " : "")
        + (props.action ? " justify-content-center" : "")
        + (props.godeep || props.isActive ? " pe-4" : "")
      }
      style={{
        flex: "0 0 " + getCellWidth(props.deep, props.cellName) + 'px',
        height: data.Env.cellHeight
      }}
      title={props.tooltip}
    >
      <div
        style={{
          opacity: props.opacity || 1,
          width: '100%'
        }}
      >
        {
          render()
        }
      </div>


      {
        deep.noDeep ? null : [
          props.godeep && !props.isActive ? <i key={0} className="fa fa-action fa-expand text-white bg-success" onClick={e => { props.onGoDeep(); }} aria-hidden="true"></i> : null,
          props.isActive ? <i key={1} className="fa fa-action  fa-compress text-white bg-danger" onClick={e => { props.onUnActive(); }} aria-hidden="true"></i> : null
        ]
      }


    </div>
  )
}


var inputIndex = 0;




function Input(props) {


  const [type, setType] = useState(props.type);

  var _eq = false;
  function eq(a, b) {
    if (_eq) return false;
    _eq = a === b;
    return _eq;
  }
  var i = inputIndex++;
  var ps = {
    onChange(e) {
      var v = '';
      if (e.target) {
        v = e.target.value;
      } else if (e instanceof moment) {
        //console.log('date', e._d);
        v = _2(e._d.getDate()) + '/' + _2(e._d.getMonth() + 1) + '/' + e._d.getFullYear();

      } else if (typeof e === 'object') {
        v = e.value;
      }
      props.onChange && props.onChange(v);
    },
    value: props.value,
    id: "input--" + i,
    className: ["datetime", "file"].indexOf(props.type) > -1 ? "" : "form-control",
    placeholder: "..."
  }
  return (
    <div className="form-group mb-3">
      <label className="mb-1 text-muted d-flex justify-content-between" htmlFor={"input--" + i}>
        <span>{props.label}</span>
        {
          props.type === "monaco" || props.type === "ckeditor" ?
            <div>
              <div title="Chuyển đổi giữa bộ soạn thảo và mã nhúng" className="form-check form-switch d-inline-flex align-items-center  align-middle" style={{ minHeight: 0 }}>
                <input className="form-check-input" type="checkbox" id="swtchType" onChange={e => {
                  setType(type === 'monaco' ? 'editor' : 'monaco');
                }} />
                <label className="form-check-label" htmlFor="swtchType"></label>
              </div>
              <span title="Mở rộng"
                className=" p-1 bg-dark-gray align-middle"
                onClick={e => {
                  SetInputFullScreen({ type: type, value: props.value, callback: (v) => { props.onChange && props.onChange(v); } })
                }}
              >
                <i class="fa fa-expand" aria-hidden="true"></i>
              </span>
            </div>
            :
            null
        }
      </label>
      {
        !eq(type, 'monaco') ? null :
          <Editor
            height="30vh"
            defaultLanguage="html"
            defaultValue={props.value}
            onChange={e => {
              props.onChange && props.onChange(e);
            }}
            theme="vs-dark"

          />
      }
      {
        !eq(type, 'ckeditor') ? null : <CKEditor editor={ClassicEditor2} data={props.value} onChange={(o, editor) => { props.onChange && props.onChange(editor.getData()); }} />
      }
      {
        !eq(props.type, 'text') ? null : <input type="text"  {...ps}></input>
      }
      {
        !eq(props.type, 'photo') ? null : <div><Photo server={data.server} prefix={props.presentText}  {...ps}></Photo></div>
      }
      {
        !eq(props.type, 'datetime') ? null : <Datetime locale="vi" dateFormat="DD/MM/yyyy" timeFormat={false} {...ps} />
      }
      {
        !eq(props.type, 'select2') ? null : <Select2 cmd={props.cmd} server={data.server} {...ps} />
      }
      {
        _eq ? null : <textarea {...ps}></textarea>
      }
    </div>
  )
}

function FormEdit(props) {
  const [refresh, setRefresh] = useState(0);
  var deep = props.deep;
  var x = deep.edit.item;

  //console.log('inDeep', props.inDeep);


  function doUpdate() {
    data.loadingText = x.ID ? 'Cập nhật...' : 'Thêm mới...';

    ParentInvoke(deep, { name: 'edit', value: x._edit });

    Refresh();
    setTimeout(() => {
      fe(data.server + deep.server.update, {
        method: 'POST',
        body: JSON.stringify(x._edit)
      }).then(rs => {
        // console.log(rs);
        // alert('');
        data.loadingText = 'done';
        Refresh();
        props.reload && props.reload();
      })
    }, data.delay)

  }
  function doDelete() {
    data.loadingText = 'Xóa...';
    Refresh();
    setTimeout(() => {
      fe(data.server + deep.server.delete, {
        method: 'POST',
        body: JSON.stringify({ ID: x._edit.ID })
      }).then(rs => {
        // console.log(rs);
        // alert('');
        data.loadingText = 'done';
        Refresh();
        props.reload && props.reload();
      })
    }, data.delay)

  }
  if (!x._edit) {
    x._edit = clone(x);
  }

  var propsForm = IsInDeep(deep) ? deep.edit.propsInDeep : deep.edit.props;


  return (
    <div className="dtb-form p-5"
      style={{ top: props.top, height: props.height }}>
      <div style={{ maxHeight: "100%" }} >
        <div className="bg-white  h-100 rounded rounded-3" style={{ maxWidth: '90%', width: 600, margin: "0 auto" }}>
          <div className="px-5 py-3">
            <h4 className="m-0">{deep.edit.title}</h4>
          </div>
          <div className="px-5 form-body" style={{ overflow: 'hidden', height: props.height - 240 }}>
            <PerfectScrollbar>
              <div>
                {
                  propsForm.map((p, pIndex) => {

                    var ps = {
                      onChange(e) {
                        x._edit[p.name] = e;
                        setRefresh(refresh + 1)
                      },
                      value: x._edit[p.name],
                      label: p.text || deep.dictionary[p.name] || p.name,
                      type: p.type
                    }

                    return <Input presentText={x._edit.Title} key={pIndex} {...ps} {...p.inputOpts}></Input>

                  })
                }
              </div>
            </PerfectScrollbar>

          </div>
          <div className="px-5 py-3 d-flex justify-content-between">
            <button className="btn btn-light" onClick={e => { props.onCancel() }}>Hủy</button>
            {
              deep.edit.action === "delete" ?
                <button className="btn btn-danger" onClick={e => doDelete()}>Xóa</button> :
                <button className="btn btn-success" onClick={e => doUpdate()}>
                  {
                    x._edit.ID ? "Cập nhật" : "Thêm mới"
                  }
                </button>
            }

          </div>
        </div>

      </div>
    </div>
  )
}



function Deep(props) {
  const [scrollTop, setScrollTop] = useState(0);
  const [refresh, setRefresh] = useState(0);

  var el = useRef();

  var deep = props.deep;
  var cols = deep.active ? deep.freeze : deep.props;
  var step = 1.0 * scrollTop / data.Env.cellHeight - 1;
  var h = data.Env.contentHeight - data.Env.cellHeight;
  var numVisi = h * 1.0 / data.Env.cellHeight + 1;
  var activeTop = 0;
  var items = deep.items.map((x, xIndex) => {
    if (deep.active === x) {
      activeTop = xIndex * data.Env.cellHeight
    }
    return x;
  })

  var scrollH = items.length * data.Env.cellHeight;
  var adjForForm = 0;

  function setForm(x, action, xIndex) {
    if (action === 'cancel') {
      deep.edit.item = null;
      deep.edit.action = '';
    } else {
      deep.edit.item = x;
      deep.edit.action = action;
      var top = xIndex * data.Env.cellHeight;
      el.current.querySelector('.ps').scrollTop = top;
      setScrollTop(top);
    }
    setRefresh(refresh + 1);
  }

  function addNew() {
    var x = deep.newItem();
    deep.items.splice(0, 0, x);
    setForm(x, 'edit', 0);
  }


  function styleDeep() {
    var flex = 0;
    if (deep.active) {
      var cn = deep.freeze[0];
      flex = getCellWidth(deep, cn);
    } else {
      deep.props.forEach(col => {
        flex += getCellWidth(deep, col);
      });
      flex += getCellWidth(deep, '--');
      flex += getCellWidth(deep, '-STT-');
    }
    var s = {
      flexGrow: 0,
      flex: '0 0 ' + flex + 'px'
    };

    return s;
  }


  return (
    <div
      className="dtb-deep d-flex  flex-column "
      style={styleDeep()}
    >
      <div className="dtb-count" title="Số dòng">{deep.items.length}</div>
      <div className="dtb-props d-flex border border-top-0 border-start-0 border-end-0">
        {
          //STT
          deep.active ? null :
            <Cell
              key={-2}
              center={true}
              deep={deep}
              cellName={"-STT-"}
              rawText={"STT"}
              border={true}
              head={true}
              opacity={.5}
            >
            </Cell>
        }
        {
          //props
          cols.map((p, pIndex) => {
            return <Cell key={pIndex} deep={deep} cellName={p} text={deep.dictionary[p] || p} first={pIndex === 0} head={true} ></Cell>
          })
        }
        {
          //action
          deep.active ? null :
            <Cell
              key={-1}
              center={true}
              deep={deep}
              cellName={"--"}
              action={
                <button
                  className="btn btn-success btn-sm py-0"
                  onClick={e => { addNew() }}
                >
                  {"+" + (deep.dictionary[deep.freeze[0]] || "")}</button>
              }
              border={true}
              head={true} >
            </Cell>
        }
      </div>
      <div
        style={{ height: 'calc(100% - ' + data.Env.cellHeight + 'px)' }}
        className="dtb-items"
        ref={el}

      >
        <PerfectScrollbar onScroll={(e) => { setScrollTop(e.target.scrollTop) }}>
          <div
            className="position-relative"
            style={{ height: items.length * data.Env.cellHeight }}>
            {
              items.map((x, xIndex) => {
                if (xIndex < step - 0.5 * numVisi) return null;
                if (xIndex > step + 1.4 * numVisi) return null;

                if (xIndex > 0 && items[xIndex - 1] === deep.edit.item) {
                  adjForForm = (numVisi) * data.Env.cellHeight;
                }

                var top = xIndex * data.Env.cellHeight + adjForForm;

                //item props
                return (
                  [
                    <div
                      className={"dtb-item d-flex " + (deep.active === x ? " dtb-item-active bg-primary text-white" : "")}
                      key={xIndex + "-0"}
                      style={{
                        top: top
                      }}
                    >
                      {
                        //STT
                        deep.active ? null :
                          <Cell
                            key={-2}
                            center={true}
                            deep={deep}
                            cellName={"-STT-"}
                            rawText={xIndex + 1}
                            tooltip={(xIndex + 1) + '/' + deep.items.length}
                            border={true}
                            head={true}
                            opacity={.5}
                          >
                          </Cell>
                      }
                      {
                        //props
                        cols.map((p, pIndex) => {


                          return <Cell
                            key={pIndex}
                            deep={deep}
                            text={x[p]}
                            first={pIndex === 0}
                            godeep={deep.freeze.indexOf(p) > -1}
                            cellName={p}
                            isActive={deep.active === x}
                            onGoDeep={e => { deep.active = x; setRefresh(refresh + 1); props.onChange(); props.onGoDeep(deep) }}
                            onUnActive={e => { deep.active = null; setRefresh(refresh + 1); props.onChange(); }}

                          >

                          </Cell>
                        })
                      }
                      {
                        //action
                        deep.active ? null :
                          <Cell
                            key={-1}
                            deep={deep}
                            cellName={"--"}
                            action={
                              x === deep.edit.item ?
                                [
                                  <button key={0} className="btn btn-light btn-sm py-0 me-2" title="Hủy" onClick={e => { setForm(x, 'cancel', xIndex) }}><i className="fa fa-times"></i></button>
                                ]
                                :
                                [
                                  <button key={0} className="btn btn-light btn-sm py-0 me-2" title="Sửa" onClick={e => { setForm(x, 'edit', xIndex) }}><i className="fa fa-edit"></i></button>,
                                  <button key={1} className="btn btn-light btn-sm py-0" title="Xóa" onClick={e => { setForm(x, 'delete', xIndex) }}><i className="fa fa-trash"></i></button>
                                ]
                            }
                            border={true} head={true} ></Cell>
                      }
                    </div>,
                    x === deep.edit.item ?
                      <FormEdit
                        key={xIndex + "-1"}
                        deep={deep}
                        top={(xIndex + 1) * data.Env.cellHeight}
                        height={data.Env.contentHeight}
                        onCancel={e => { setForm(null, 'cancel') }}
                        inDeep={props.inDeep}
                        reload={e => {
                          props.reload && props.reload();
                        }}
                      ></FormEdit> : null
                  ]
                )
              })
            }
          </div>
        </PerfectScrollbar>

        {
          deep.active ? <div className="ps-green-bookmark" style={{ transform: "translateY(" + ((activeTop + adjForForm) * h / scrollH) + "px)" }}></div> : null
        }

      </div>
    </div>

  )
}

function IsInDeep(deep) {
  var i = data.Deeps.indexOf(deep);
  return i !== _startDeepIndex;
}

function PagingSetting(props) {
  const [ps, setPs] = useState(props.ps);
  const [pi, setPi] = useState(props.pi);
  var arr = [];
  for (var i = 1; i <= props.pcount; i++) {
    arr.push(i);
  }
  return (
    <div>
      <label className="mb-1 text-muted">Trang:</label>
      <div>
        {
          arr.map(i => {
            return <button key={i} onClick={e => { setPi(i); setTimeout(() => { props.onPiClick && props.onPiClick(i) }, 50) }} style={{ fontSize: 11 }} className={"btn  btn-sm m-1 " + (i === pi ? "btn-success" : "btn-light")}>{i}</button>
          })
        }
      </div>
      <hr />
      <div className="form-group">
        <label className="mb-1 text-muted">Số dòng trên một trang</label>
        <div className="input-group">
          <input className="form-control" type="number" value={ps} onChange={e => { setPs(parseInt(e.target.value)) }}></input>
          <button className="btn btn-success" onClick={e => { props.onPsChange && props.onPsChange(ps) }}>Thay đổi</button>
        </div>

      </div>
    </div>
  )
}

function RenderFilter(props) {
  var deep = props.deep;
  var inDeep = IsInDeep(deep);
  var ft = inDeep ? deep.filterInDeep : deep.filter;

  if (!deep.resetFilter) {
    deep.resetFilter = {
      filterInDeep: clone(deep.filterInDeep),
      filter: clone(deep.filter),
    }
  }
  const [refresh, setRefresh] = useState(0);




  return (
    <div>
      {
        ft.map((p, pIndex) => {
          var ps = {
            onChange(e) {
              p.value = e;
              setRefresh(refresh + 1);
            },
            value: p.value,
            label: p.text || deep.dictionary[p.name] || p.name,
            type: p.type
          }
          return <Input key={pIndex} {...ps} {...p.inputOpts}></Input>
        })
      }
      <div className="d-flex flex-row-reverse">
        <button className="btn btn-success" onClick={e => {
          props.onFilter && props.onFilter();
        }}>Thực hiện</button>

        <button className="btn btn-light me-2" onClick={e => {
          deep.filterInDeep = clone(deep.resetFilter.filterInDeep);
          deep.filter = clone(deep.resetFilter.filter);
          setRefresh(refresh + 1);
        }}>Làm lại</button>
      </div>
    </div>
  );

}

var Refresh;
var _startDeepIndex = -1;
var SetInputFullScreen;
function App() {

  var $el = useRef();
  const [refresh, setRefresh] = useState(0);
  const [startDeepIndex, setStartDeepIndex] = useState(0);
  const [modelShow, setModelShow] = useState(false);
  const [modelOpts, setModelOpts] = useState({ title: "", buttons: null, body: null });
  const [inputFull, setInputFull] = useState({ type: '', value: '', callback: null, show: false });
  //const [preActiveState, setPreActiveState] = useState({ });

  var crDeep = null;
  function resetActive() {
    data.Deeps.forEach(function (d, dIndex) {
      d.active = null;
    })
  }

  Refresh = (v) => {
    setRefresh(refresh + 1);
  }
  SetInputFullScreen = (opt) => {
    for (var k in inputFull) {
      if (opt[k]) inputFull[k] = opt[k];
    }
    inputFull.show = true;
    setInputFull(inputFull);
    setRefresh(refresh + 1);
  }
  function loadData(deep, pi) {
    data.loadingText = 'Loading...';
    if (pi) deep.pgs.pi = pi;
    setRefresh(refresh + 1);
    var filter = {};
    var deepIndex = data.Deeps.indexOf(deep);
    var inDeep = deepIndex !== startDeepIndex;
    deep[inDeep ? "filterInDeep" : "filter"].forEach(function (f) {
      filter[f.name] = f.value
    })
    filter._indeep = inDeep ? 1 : 0;
    if (inDeep) {

      ParentInvoke(deep, { name: 'load', value: filter })
    }
    setTimeout(() => {

      fe(data.server + deep.server.get, {
        method: 'POST',
        body: JSON.stringify({
          filter: filter,
          pi: deep.pgs.pi,
          ps: deep.pgs.ps,
        })
      }).then(rs => {
        //console.log('rs',rs);
        data.loadingText = '';
        deep.items = rs.data;
        deep.pgs.pi = rs.other.pi;
        deep.pgs.ps = rs.other.ps;
        deep.pgs.pcount = rs.other.pcount;
        deep.pgs.total = rs.other.total;

        Refresh();

      })
    }, data.delay)




  }
  function goNav(dir) {

    var pi = crDeep.pgs.pi;
    pi += dir;
    pi = Math.max(pi, 0);
    pi = Math.min(pi, crDeep.pgs.pcount);
    loadData(crDeep, pi);

  }
  function showFilter() {

    modelOpts.title = `Bộ lọc của "${crDeep.title}"`;
    modelOpts.buttons = null;


    modelOpts.body = <RenderFilter
      deep={crDeep}
      inDeep={data.Deeps.indexOf(crDeep) !== startDeepIndex}
      onFilter={e => { loadData(crDeep, 1) }}
    ></RenderFilter>
    setModelOpts(modelOpts);
    setModelShow(true);
  }

  function showPgs() {
    modelOpts.title = `Phân trang của "${crDeep.title}"`;
    var pgs = clone(crDeep.pgs);
    modelOpts.body = <PagingSetting
      ps={pgs.ps}
      pcount={pgs.pcount}
      pi={pgs.pi}
      onPiClick={pi => { crDeep.pgs.pi = pi; setModelShow(false); loadData(crDeep); }}
      onPsChange={ps => { crDeep.pgs.ps = ps; setModelShow(false); loadData(crDeep); }}
    ></PagingSetting>;

    setModelOpts(modelOpts);
    setModelShow(true);
  }

  var pathActive = true;
  var breadcrumb = [];
  data.Deeps.forEach(function (d, dIndex) {
    d.visibled = false;
    if (dIndex < startDeepIndex) return;
    if (!pathActive) return null;
    d.visibled = true;
    crDeep = d;
    pathActive = d.active ? pathActive : false;
    breadcrumb.push({ title: d.title, count: d.items.length });
  })


  useEffect(() => {
    if (_startDeepIndex !== startDeepIndex) {
      _startDeepIndex = startDeepIndex;
      loadData(crDeep, 1);
    }
  })

  function countFilter() {
    var count = 0;
    var inDeep = IsInDeep(crDeep);
    var n = inDeep ? 'filterInDeep' : 'filter';
    if (crDeep.resetFilter) {
      crDeep.resetFilter[n].forEach(function (f1) {
        crDeep[n].forEach(function (f2) {
          if (f1.name === f2.name) {
            count += f1.value !== f2.value ? 1 : 0;
          }
        })
      })
    }
    return count;
  }


  if (inputFull.show) {
    return (
      <div className="d-flex h-100 w-100 flex-column">
        <div className="d-flex flex-row-reverse align-items-center" style={{ flex: data.Env.fullInput.head }}>
          <span title="Thu nhỏ" className="btn btn-sm btn-light mx-2" onClick={e => {
            inputFull.show = false;
            if(inputFull.callback) inputFull.callback(inputFull.value);
            setInputFull(inputFull);
            setRefresh(refresh + 1);
          }}>
            <i class="fa fa-compress" aria-hidden="true"></i>
          </span>
        </div>
        <div className="flex-grow-1">
          <div className="h-100 overflow-hidden position-relative">
            <PerfectScrollbar>
              {
                //ckeditor
                inputFull.type !== "ckeditor" ? null :
                  <CKEditor editor={ClassicEditor2} data={inputFull.value} onChange={(o, editor) => { inputFull.value= editor.getData() }} />
              }
              {
                //monaco editor
                inputFull.type !== "monaco" ? null :
                  <Editor
                    height= { data.Env.fullInput.monacoHeight}
                    defaultLanguage="html"
                    defaultValue={inputFull.value}
                    onChange={e => {
                      inputFull.value =  e;
                    }}
                    theme="vs-dark"

                  />
              }
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={e => {
        if (data.loadingText === 'done') {
          data.loadingText = '';
          setRefresh(refresh + 1);
        }
      }}
      className={"dtb-wrap h-100" + (data.loadingText && data.loadingText !== 'done' ? " dtb-noact" : "")} >
      <div className="DeepTable dtb d-flex- flex-grow-1 h-100 mx-3">
        <div className="dtb-inner d-flex flex-grow-1 flex-column h-100">
          <div className="dtb-head align-items-center d-flex justify-content-between">
            <nav aria-label="breadcrumb">
              <Breadcrumb className="dtb-bread" >
                {
                  breadcrumb.map((br, brIndex) => {
                    if (brIndex === 0) {
                      return (
                        <NavDropdown className="breadcrumb-item" key={0} title={br.title} >
                          {
                            data.Deeps.map((x, i) => {
                              return <NavDropdown.Item key={i} href="" onClick={e => { setStartDeepIndex(i); resetActive() }}>{x.title}</NavDropdown.Item>
                            })
                          }
                        </NavDropdown>
                      )
                    }
                    return (
                      <Breadcrumb.Item key={brIndex} >{br.title}</Breadcrumb.Item>
                    )
                  })
                }
              </Breadcrumb>
            </nav>
            <div className="dtb-control text-muted d-flex dtb-pgs align-items-center">
              <span>
                Hiện thị {crDeep.pgs.ps * (crDeep.pgs.pi - 1) + 1} - {crDeep.pgs.ps * (crDeep.pgs.pi - 1) + crDeep.items.length} dòng/ Tổng:{crDeep.pgs.total}.
              </span>
              <span className="d-flex dtb-pgs-nav ms-3 btn-group btn-group-sm" >
                <button className="btn btn-sm btn-light" onClick={e => loadData(crDeep)}><i className="fa fa-refresh" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" disabled={crDeep.pgs.pi === 1} onClick={e => goNav(-1)}><i className="fa fa-angle-left" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" onClick={e => showPgs()}><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" disabled={crDeep.pgs.pi === crDeep.pgs.pcount} onClick={e => goNav(1)}><i className="fa fa-angle-right" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" onClick={e => showFilter()}>
                  <i className="fa fa-filter" aria-hidden="true"></i>
                  <span data-count={countFilter()}></span>
                </button>
              </span>
            </div>
          </div>
          <div ref={$el} className="dtb-main d-flex flex-grow-1 flex-column border border-top-0 border-start-0 mb-3">
            <div className="dtb-content d-flex flex-grow-1" style={{ height: data.Env.contentHeight }}>
              {
                data.Deeps.map((d, dIndex) => {
                  if (!d.visibled) return null;
                  return (
                    <Deep
                      deep={d}
                      inDeep={dIndex !== startDeepIndex}
                      key={dIndex}
                      up={data.Deeps[dIndex - 1]}
                      onChange={e => { setRefresh(refresh + 1) }}
                      onGoDeep={deep => {
                        var i = data.Deeps.indexOf(deep);
                        loadData(data.Deeps[i + 1], 1);
                      }}
                      reload={e => {
                        loadData(d, 1)
                      }}
                    ></Deep>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <Modal show={modelShow} onHide={e => { setModelShow(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {
              modelOpts.title
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            modelOpts.body
          }
        </Modal.Body>
        {
          modelOpts.buttons ? (<Modal.Footer>
            {
              modelOpts.buttons
            }
          </Modal.Footer>) : null
        }

      </Modal>
      {
        data.loadingText ?
          <div className={"dtb-loading" + (data.loadingText === 'done' ? ' _done' : '')}>
            {
              data.loadingText === 'done' ?
                <div>Đã cập nhật</div>
                :
                <div>
                  <div className="spinner-grow text-light spinner-grow-sm me-1" role="status">
                    <span className="visually-hidden"></span>
                  </div>
                  {data.loadingText}
                </div>
            }

          </div> : null
      }
    </div>

  );
}




export default App;

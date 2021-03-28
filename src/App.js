import { useRef, useEffect, useState } from 'react';
import './App.css';
import { Demo } from './Common/Demo';
import { getScrollbarWidth } from './Common/Helper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Nav, NavDropdown, Breadcrumb, Modal } from 'react-bootstrap';
var data = {

  loadingText: '',
  Deeps: [
    {
      title: 'Khóa học',
      visibled: false,
      props: ['Title', 'VideoLink', 'CertHtml', 'BgImage'],
      freeze: ['Title'],
      active: null,
      items: [],
      dictionary: {
        'Title': 'Khóa học',
        'VideoLink': 'Video Giới thiệu',
        'CertHtml': 'Chứng chỉ',
        'BgImage': 'Ảnh nền'
      },
      edit: {
        item: null,
        action: '',
        title: 'Chi tiết khóa học'
      },
      newItem() {
        return {
          Title: 'Khóa học ',
          VideoLink: '',
          CertHtml: '',
          BgImage: '',
          ID: 0
        }
      },
      resizes: {
        //cellName: zise
      },
      pgs: {
        total: 100,
        pi: 1,
        ps: 100,
        pcount: 10
      },
      filters: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ],
      filterInDeep: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ]
    },
    {
      title: 'Bài học',
      visibled: false,
      props: ['Title', 'MedalHtml', 'ActivityHtml', 'ID'],
      freeze: ['Title'],
      active: null,
      items: [],
      dictionary: {
        'Title': 'Bài học',
      },
      onParent(pr, item) {
        return item.CourseID === pr.ID;
      },
      edit: {
        item: null,
        action: '',
        title: 'Chi tiết Bài học'
      },
      newItem() {
        return {
          Title: 'Bài học',
          ID: 0,
          CourseID: 0,
          MedalHtml: '',
          ActivityHtml: ''
        }
      },
      resizes: {
        //cellName: zise
      },
      pgs: {
        total: 100,
        pi: 1,
        ps: 100,
        pcount: 10
      },
      filters: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ],
      filterInDeep: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ]
    },
    {
      title: 'Hành động',
      visibled: false,
      props: ['Title', 'MaxPoint', 'SrcMobile', 'SrcDesktop', 'Images'],
      freeze: ['Title'],
      active: null,
      items: [],
      dictionary: {
        'Title': 'Hành động',
      },
      onParent(pr, item) {
        return item.LessonID === pr.ID;
      },
      edit: {
        item: null,
        action: '',
        title: 'Chi tiết hoạt động'
      },
      newItem() {
        return {
          Title: 'Hoạt động',
          ID: 0,
          LessonID: 0,
        }
      },
      noDeep: true,
      resizes: {
        //cellName: zise
      },
      pgs: {
        total: 100,
        pi: 1,
        ps: 100,
        pcount: 10
      },
      filters: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ],
      filterInDeep: [
        { name: "from", value: "", type: "datetime" },
        { name: "to", value: "", type: "datetime" }
      ]
    }
  ],
  Env: {
    width: 250,
    ScrollbarWidth: getScrollbarWidth(),
    contentHeight: 0.8 * window.innerHeight,
    cellHeight: 36,
    cellWidth: 250
  }

}
function clone(x) {
  var z = JSON.parse(JSON.stringify(x));
  return z;
}
var _deep = clone(data.Deeps[0])
function CreatDeep() {
  return clone(_deep);
}
Demo(data);

if (window.DeepTableCreator) window.DeepTableCreator(data, { CreatDeep: CreatDeep });

var div;
function rawText(complexText) {
  if (complexText && typeof (complexText) === 'string' && complexText.indexOf('<') === -1) return complexText;
  if (!div) {
    div = document.createElement('div');

  }
  div.innerHTML = complexText;
  return div.innerText;
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
  }
  return w;
}
function Cell(props) {

  var deep = props.deep;

  function render() {
    return props.rawText ? props.rawText :
      props.action ? props.action :
        (<div className={"text-truncate"}>
          {
            rawText(props.text)
          }
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
          props.godeep && !props.isActive ? <i key={0} className="fa fa-action fa-expand" onClick={e => { props.onGoDeep(); }} aria-hidden="true"></i> : null,
          props.isActive ? <i key={1} className="fa fa-action  fa-compress" onClick={e => { props.onUnActive(); }} aria-hidden="true"></i> : null
        ]
      }


    </div>
  )
}

function Form(props) {
  const [refresh, setRefresh] = useState(0);
  var deep = props.deep;
  var x = deep.edit.item;


  if (!x._edit) {
    x._edit = JSON.parse(JSON.stringify(x));
  }
  var cols = deep.edit.props || deep.props;
  return (
    <div className="dtb-form p-5"
      style={{ top: props.top, height: props.height }}>
      <div style={{ maxHeight: "100%" }} >
        <div className="bg-white  h-100 rounded rounded-3" style={{ maxWidth: '90%', width: 600, margin: "0 auto" }}>
          <div className="px-5 py-3">
            <h4 className="m-0">{deep.edit.title}</h4>
          </div>
          <div className="px-5" style={{ overflow: 'hidden', maxHeight: 'calc(100% - 120px)' }}>
            <PerfectScrollbar>
              <div>
                {
                  cols.map((p, pIndex) => {
                    return (
                      <div key={pIndex} className="form-group mb-3">
                        <label className="mb-1 text-muted" htmlFor={pIndex + "-input"}>{deep.dictionary[p] || p}</label>
                        <textarea className="form-control" id={pIndex + "-input"} onChange={e => { x._edit[p] = e.target.value; setRefresh(refresh + 1) }} value={x._edit[p]}></textarea>
                      </div>
                    )
                  })
                }
              </div>
            </PerfectScrollbar>

          </div>
          <div className="px-5 py-3 d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={e => { props.onCancel() }}>Hủy</button>
            {
              deep.edit.action === "delete" ?
                <button className="btn btn-danger">Xóa</button> :
                <button className="btn btn-success">
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
                  className="btn btn-light btn-sm py-0"
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
                            godeep={pIndex === 0}
                            cellName={p}
                            isActive={deep.active === x}
                            onGoDeep={e => { deep.active = x; setRefresh(refresh + 1); props.onChange(); }}
                            onUnActive={e => { deep.active = null; setRefresh(refresh + 1); props.onChange() }}

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
                      <Form
                        key={xIndex + "-1"}
                        deep={deep}
                        top={(xIndex + 1) * data.Env.cellHeight}
                        height={data.Env.contentHeight}
                        onCancel={e => { setForm(null, 'cancel') }}
                      ></Form> : null
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
            return <button key={i} onClick={e => { setPi(i) ; setTimeout(()=>{props.onPiClick && props.onPiClick(i)},100) }} style={{ fontSize: 11 }} className={"btn  btn-sm m-1 " + (i === pi ? "btn-success" : "btn-light")}>{i}</button>
          })
        }
      </div>
      <div className="form-group">
        <label className="mb-1 text-muted">Số dòng trên một trang</label>
        <input className="form-control" type="number" value={ps} onChange={e => { setPs(parseInt(e.target.value)) }}></input>
      </div>
    </div>
  )
}

function App() {

  var $el = useRef();
  const [refresh, setRefresh] = useState(0);
  const [startDeepIndex, setStartDeepIndex] = useState(0);
  const [modelShow, setModelShow] = useState(false);
  const [modelOpts, setModelOpts] = useState({ title: "", buttons: null, body: null });

  var crDeep = null;
  function resetActive() {
    data.Deeps.forEach(function (d, dIndex) {
      d.active = null;
    })
  }

  function goNav(dir) {

  }
  function showFilter(inDeep) {
    modelOpts.title = `Bộ lọc của "${crDeep.title}"`;
    modelOpts.buttons = [
      <button className="btn btn-light" onClick={e => setModelShow(false)}>Hủy</button>,
      <button className="btn btn-success">Thực hiện</button>
    ];

    modelOpts.body = (
      <div>

      </div>
    );

    setModelOpts(modelOpts);
    setModelShow(true);
  }
  function loadData() {
    setRefresh(refresh + 1);
    console.log(crDeep.pgs);
  }
  function showPgs(inDeep) {
    modelOpts.title = `Phân trang của "${crDeep.title}"`;
    var pgs = clone(crDeep.pgs);
    modelOpts.body = <PagingSetting ps={pgs.ps} pcount={pgs.pcount} pi={pgs.pi} onPiClick={pi => { crDeep.pgs.pi = pi; setModelShow(false); loadData(); }}></PagingSetting>;

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

  return (
    <div className={"dtb-wrap h-100" + (data.loadingText ? " dtb-noact" : "")} >
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
                              return <NavDropdown.Item key={i}  href="" onClick={e => { setStartDeepIndex(i); resetActive() }}>{x.title}</NavDropdown.Item>
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
                <button className="btn btn-sm btn-light" disabled={true} onClick={e => goNav(-1)}><i className="fa fa-angle-left" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" onClick={e => showPgs(breadcrumb.length > 0)}><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" disabled={true} onClick={e => goNav(1)}><i className="fa fa-angle-right" aria-hidden="true"></i></button>
                <button className="btn btn-sm btn-light" onClick={e => showFilter(breadcrumb.length > 0)}><i className="fa fa-filter" aria-hidden="true"></i></button>
              </span>
            </div>
          </div>
          <div ref={$el} className="dtb-main d-flex flex-grow-1 flex-column border border-top-0 border-start-0 mb-3">
            <div className="dtb-content d-flex flex-grow-1" style={{ height: data.Env.contentHeight }}>
              {
                data.Deeps.map((d, dIndex) => {
                  if (!d.visibled) return null;
                  return (
                    <Deep deep={d} key={dIndex} up={data.Deeps[dIndex - 1]} onChange={e => { setRefresh(refresh + 1) }}></Deep>
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
        <Modal.Footer>
          {
            modelOpts.buttons
          }
        </Modal.Footer>
      </Modal>
      {
        data.loadingText ?
          <div className="dtb-loading">
            <div class="spinner-grow text-light spinner-grow-sm me-1" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            {data.loadingText}
          </div> : null
      }
    </div>

  );
}

export default App;

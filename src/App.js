import { useRef, useEffect, useState } from 'react';
import './App.css';
import { Demo } from './Common/Demo';
import { getScrollbarWidth } from './Common/Helper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

var data = {
  Title: 'Nội dung',
  Items: [],
  Deeps: [
    {
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
      }
    },
    {
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
      }
    },
    {
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
      noDeep: true
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

Demo(data);

if (window.DeepTableCreator) window.DeepTableCreator(data);

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
  return data.Env.cellWidth;
}
function Cell(props) {

  var deep= props.deep;

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
    >
      {
        props.action ? props.action :
          (<div className={"text-truncate"}>
            {
              rawText(props.text)
            }
          </div>)
      }

      {
        deep.noDeep ? null: [
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
    <div
      className="dtb-form p-5"
      style={{ top: props.top, height: props.height }}
    >
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
  function form(x, action, xIndex) {
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
    form(x, 'edit', 0);
  }


  function styleDeep() {
    var flex = 0;
    if (deep.active) {
      var cn = deep.freeze[0];
      flex = getCellWidth(deep, cn);
    } else {
      deep.props.forEach(col => {
        flex+= getCellWidth(deep,col);
      });
      flex+= getCellWidth(deep,'--');
    }
    var s = {
      flexGrow: 0,
      flex: '0 0 ' + flex + 'px'
    };

    return s;
  }


  return (
    <div

      style={styleDeep()}
      className="dtb-deep d-flex  flex-column">
      <div className="dtb-props d-flex border border-top-0 border-start-0 border-end-0">
        {
          cols.map((p, pIndex) => {
            return <Cell key={pIndex} deep={deep} cellName={p} text={deep.dictionary[p] || p} first={pIndex === 0} head={true} ></Cell>
          })
        }
        {
          deep.active ? null :
            <Cell
              key={-1}
              center={true}
              width={150}
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
        <PerfectScrollbar  onScroll={(e) => { setScrollTop(e.target.scrollTop) }}>
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
                        deep.active ? null :
                          <Cell
                            key={-1}
                            width={150}
                            deep={deep}
                            cellName={"--"}
                            action={
                              x === deep.edit.item ?
                                [
                                  <button key={0} className="btn btn-light btn-sm py-0 me-2" title="Hủy" onClick={e => { form(x, 'cancel', xIndex) }}><i className="fa fa-times"></i></button>
                                ]
                                :
                                [
                                  <button key={0} className="btn btn-light btn-sm py-0 me-2" title="Sửa" onClick={e => { form(x, 'edit', xIndex) }}><i className="fa fa-edit"></i></button>,
                                  <button key={1} className="btn btn-light btn-sm py-0" title="Xóa" onClick={e => { form(x, 'delete', xIndex) }}><i className="fa fa-trash"></i></button>
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
                        onCancel={e => { form(null, 'cancel') }}
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



function App() {

  var $el = useRef();
  const [refresh, setRefresh] = useState(0);

  var pathActive = true;
  return (
    <div className="DeepTable dtb d-flex- flex-grow-1 h-100 mx-3">
      <div className="dtb-inner d-flex flex-grow-1 flex-column h-100">
        <h1>{data.Title}</h1>
        <div ref={$el} className="dtb-main d-flex flex-grow-1 flex-column border border-top-0 mb-3">
          <div className="dtb-content d-flex flex-grow-1" style={{ height: data.Env.contentHeight }}>
            {
              data.Deeps.map((d, dIndex) => {
                if (!pathActive) return null;
                pathActive = d.active ? pathActive : false;
                return (
                  <Deep deep={d} key={dIndex} up={data.Deeps[dIndex - 1]} onChange={e => { setRefresh(refresh + 1) }}></Deep>
                )
              })
            }
          </div>


        </div>
      </div>
    </div>
  );
}

export default App;

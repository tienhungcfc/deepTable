import { useRef, useEffect, useState } from 'react';
import './App.css';
import { Demo } from './Common/Demo';
import { getScrollbarWidth } from './Common/Helper';


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
        action: ''
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
        action: ''
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
        action: ''
      }
    }
  ],
  formOf: {
    //deepIndex: true
  },
  Env: {
    width: 250,
    ScrollbarWidth: getScrollbarWidth(),
    contentHeight: 0.8 * window.innerHeight,
    cellHeight: 36,

  }


}

Demo(data);

if (window.DeepTableCreator) window.DeepTableCreator(data);

var div;
function rawText(complexText) {
  if (complexText && complexText.indexOf('<') === -1) return complexText;
  if (!div) {
    div = document.createElement('div');

  }
  div.innerHTML = complexText;
  return div.innerText;
}

function Cell(props) {
  return (
    <div
      className={"dtb-prop dtb-cell d-flex px-3 border border-top-0 border-start-0"
        + (props.head ? " dtb-head " : "")
        + (props.first > 0 ? " " : "")
        + (props.action ? " justify-content-center" : "")
      }
      style={{
        flex: "0 0 " + data.Env.width + 'px',
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
      <div className="h-100 px-5" style={{ overflowY: 'scroll', maxWidth: '90%', width:600, margin:"0 auto" }}>
        {
          cols.map((p, pIndex) => {
            return (
              <div  key={pIndex} className="form-group">
                <label for={pIndex +"-input"}>
                  {
                    deep.dictionary[p] || p
                  }
                </label>
                <input className="form-control" id={pIndex +"-input"}  onChange={e=> { x._edit[p]= e.target.value; setRefresh(refresh+1)  }} value={x._edit[p]}></input>
              </div>
            )
          })
        }
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
  var items = deep.items.map(x => {
    return x;
  })

  function form(x, action, xIndex) {
    if (action === 'cancel') {
        deep.edit.item = null;
      deep.edit.action = '';
    } else {
        deep.edit.item = x;
      deep.edit.action = action;
    }
    var top = xIndex * data.Env.cellHeight;
    el.current.scrollTop = top;
    setScrollTop(top);
    setRefresh(refresh + 1);
  }

  var adjForForm = 0;
  return (
      <div

        style={{ flexGrow: 1 }}
        className="dtb-deep d-flex flex-grow-1 flex-column">
        <div className="dtb-props d-flex border border-top-0 border-start-0 border-end-0">
          {
            cols.map((p, pIndex) => {
              return <Cell key={pIndex} text={deep.dictionary[p] || p} first={pIndex === 0} head={true} ></Cell>
            })
          }
          {
            deep.active ? null :
              <Cell
                key={-1}
                center={true}
                width={150}
                action={
                  <button className="btn btn-light btn-sm py-0">{"+" + (deep.dictionary[deep.freeze[0]] || "")}</button>
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
          onScroll={(e) => { setScrollTop(e.target.scrollTop) }}
        >
          <div
            className="position-relative"
            style={{ height: items.length * data.Env.cellHeight }}
          >
            {
              items.map((x, xIndex) => {
                if (xIndex < step - 0.5 * numVisi) return null;
                if (xIndex > step + 1.4 * numVisi) return null;

                if (xIndex > 0 && items[xIndex - 1] === deep.edit.item) {
                  adjForForm = (numVisi) * data.Env.cellHeight;
                }
                return (
                  [
                    <div
                      className="dtb-item d-flex "
                      key={xIndex + "-0"}
                      style={{
                        top: xIndex * data.Env.cellHeight + adjForForm
                      }}
                    >
                      {
                        cols.map((p, pIndex) => {
                          return <Cell key={pIndex} text={x[p]} first={pIndex === 0}></Cell>
                        })
                      }
                      {
                        deep.active ? null :
                          <Cell key={-1} width={150}
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
                      ></Form> : null
                  ]
                )
              })
            }
          </div>

        </div>
      </div>

  )
}

function App() {

  var $el = useRef();
  // const [refresh, setRefresh] = useState(0);
  return (
      <div className="DeepTable dtb d-flex- flex-grow-1 h-100 mx-3">
        <div className="dtb-inner d-flex flex-grow-1 flex-column h-100">
          <h1>{data.Title}</h1>
          <div ref={$el} className="dtb-main d-flex flex-grow-1 flex-column border border-top-0 mb-3">
            <div className="dtb-content d-flex flex-grow-1" style={{ height: data.Env.contentHeight }}>
              {
                data.Deeps.map((d, dIndex) => {
                  if (dIndex > 0 && (!data.Deeps[dIndex - 1].active)) return null;

                  return (
                    <Deep deep={d} key={dIndex} up={data.Deeps[dIndex - 1]}></Deep>
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

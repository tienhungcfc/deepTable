function clone(x) {
    var z = JSON.parse(JSON.stringify(x));
    return z;
  }

function Demo(data) {
    data.delay = 250;
    //server
    data.server = 'http://localhost:3571';
    //courde
    data.Deeps[0].title = 'Khóa học';
    //Cột hiện thị theo đúng thứ tự
    data.Deeps[0].props = ['Title', 'ID', 'VideoLink', 'CertHtml', 'BgImage'];
    data.Deeps[0].dictionary = {
        'Title': 'Khóa học',
        'VideoLink': 'Video Giới thiệu',
        'CertHtml': 'Chứng chỉ',
        'BgImage': 'Ảnh nền'
    }
    //Tiêu đề form chi tiết(chỉnh sửa, thêm mới)
    data.Deeps[0].edit.title = 'Chi tiết khóa học';
    //Khởi tạo  mới
    data.Deeps[0].newItem = () => {
        return {
            Title: 'Khóa học ',
            VideoLink: '',
            CertHtml: '',
            BgImage: '',
            ID: 0
        }
    }

    //Các thuộc tính cho form chỉnh sửa, thêm mới
    var a = [
        //{name, text[option], type[option: mặc định textarea]}
        { name: "Title" },
        { name: "VideoLink", type: "text" },
        { name: "CertHtml", type: 'editor' },
        { name: "BgImage", type: "photo" },
    ];
    //chế độ đơn lẻ
    data.Deeps[0].edit.props = a;
    //chế độ cây 
    data.Deeps[0].edit.propsInDeep = a;
    data.Deeps[0].server.update = '/api/v5/course?cmd=update';
    data.Deeps[0].server.delete = '/api/v5/course?cmd=delete';
    data.Deeps[0].server.get = '/api/v5/course?cmd=get';
    //data.Deeps[0].pgs.ps= 3;


    //Lesson
    data.Deeps[1].title = 'Bài học';
    data.Deeps[1].props = ['Title', 'MedalHtml', 'ActivityHtml'];
    data.Deeps[1].dictionary = {
        'Title': 'Bài học',
        'MedalHtml': 'Huy hiệu',
        'ActivityHtml': 'Hoạt động',
        'CourseID': 'Khóa học'
    }
    data.Deeps[1].edit.title = 'Chi tiết Bài học';
    data.Deeps[1].newItem = () => {
        return {
            Title: 'Bài học',
            ID: 0,
            CourseID: 0,
            MedalHtml: '',
            ActivityHtml: ''
        }
    }
    let b = [
        
        { name: "Title" },
        { name: "MedalHtml", },
        { name: "ActivityHtml" },

    ];

    data.Deeps[1].filter.push({ name: 'CourseID', type: 'select2', inputOpts: { cmd: "course" } });
    data.Deeps[1].edit.props = b;
    data.Deeps[1].edit.propsInDeep = clone( b);

    data.Deeps[1].edit.props.push({ name: "CourseID", type: "select2", inputOpts: { cmd: "course" } });

    data.Deeps[1].server.update = '/api/v5/lesson?cmd=update';
    data.Deeps[1].server.delete = '/api/v5/lesson?cmd=delete';
    data.Deeps[1].server.get = '/api/v5/lesson?cmd=get';
    data.Deeps[1].onParentSet = (pr, adj) => {
        //console.log('pr',pr);
        switch (adj.name) {
            case 'edit':
                adj.value.CourseID = pr.ID;
                break;
            case 'load':
                adj.value.CourseID= 'sql://non;='+ pr.ID;
                break;
        }
    }


    //Activity
    data.Deeps[2].noDeep = true;
    data.Deeps[2].title = 'Hoạt động';
    data.Deeps[2].props = ['Title', 'MaxPoint', 'SrcMobile', 'SrcDesktop', 'Images'];
    data.Deeps[2].dictionary = {
        'Title': 'Hoạt động',
        'MaxPoint': 'Điểm tối đa',
        'SrcMobile': 'Link Mobile',
        'SrcDesktop': 'Link Desktop',
        'Images': 'Ảnh',
        'LessonID': 'Bài học'
    }
    data.Deeps[2].edit.title = 'Chi tiết Hoạt động';
    data.Deeps[2].newItem = () => {
        return {
            Title: 'Hoạt động',
            LessonID: 0,
            ID: 0,
            MaxPoint: 0,
            SrcMobile: '',
            SrcDesktop: '',
            Images: ''
        }
    }
    let c = [
        
        { name: "Title" },
        { name: "MaxPoint", },
        { name: "SrcMobile" },
        { name: "SrcDesktop" },
        { name: "Images" },
    ];
    data.Deeps[2].edit.props = c;
    data.Deeps[2].edit.propsInDeep = clone(c);

    data.Deeps[2].edit.props.push({ name: "LessonID", type: "select2", inputOpts: { cmd: "lesson" } });

    data.Deeps[2].server.update = '/api/v5/activity?cmd=update';
    data.Deeps[2].server.delete = '/api/v5/activity?cmd=delete';
    data.Deeps[2].server.get = '/api/v5/activity?cmd=get';
    data.Deeps[2].onParentSet = (pr, adj) => {
        //console.log('pr',pr);
        switch (adj.name) {
            case 'edit':
                adj.value.LessonID = pr.ID;
                break;
            case 'load':
                adj.value.LessonID= 'sql://non;='+ pr.ID;
                break;
        }
    }
}
export { Demo }
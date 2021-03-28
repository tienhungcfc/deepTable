function Demo(data) {
    data.server = 'http://localhost:3571';
    //courde
    data.Deeps[0].title = 'Khóa học';
    data.Deeps[0].props = ['Title', 'VideoLink', 'CertHtml', 'BgImage'];
    data.Deeps[0].dictionary = {
        'Title': 'Khóa học',
        'VideoLink': 'Video Giới thiệu',
        'CertHtml': 'Chứng chỉ',
        'BgImage': 'Ảnh nền'
    }
    data.Deeps[0].edit.title = 'Chi tiết khóa học';
    data.Deeps[0].newItem = () => {
        return {
            Title: 'Khóa học ',
            VideoLink: '',
            CertHtml: '',
            BgImage: '',
            ID: 0
        }
    }
    var a = [
        { name: "Title" },
        { name: "VideoLink", type: "text" },
        { name: "CertHtml", type: 'editor' },
        { name: "BgImage", type: "file" },
    ];
    data.Deeps[0].edit.props = a;
    data.Deeps[0].edit.propsInDeep = a;
    data.Deeps[0].server.update = '/api/v5/course?cmd=update';
    data.Deeps[0].server.delete = '/api/v5/course?cmd=delete';
    data.Deeps[0].server.get = '/api/v5/course?cmd=get';


    //Lesson
    data.Deeps[1].title = 'Bài học';
    data.Deeps[1].props = ['Title', 'MedalHtml', 'ActivityHtml', 'ID'];
    data.Deeps[1].dictionary = {
        'Title': 'Bài học',

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
    data.Deeps[1].edit.props = [];
    data.Deeps[1].edit.propsInDeep = [];
    data.Deeps[1].server.update = '/api/v5/lesson?cmd=update';
    data.Deeps[1].server.delete = '/api/v5/lesson?cmd=delete';
    data.Deeps[1].server.get = '/api/v5/lesson?cmd=get';



    //Activity
    data.Deeps[2].title = 'Hành động';
    data.Deeps[2].props = ['Title', 'MaxPoint', 'SrcMobile', 'SrcDesktop', 'Images'];
    data.Deeps[2].dictionary = {
        'Title': 'Bài học',

    }
    data.Deeps[2].edit.title = 'Chi tiết Hành động';
    data.Deeps[2].newItem = () => {
        return {
            Title: 'Hành động',
            LessonID: 0,
            ID: 0
        }
    }
    data.Deeps[2].edit.props = [];
    data.Deeps[2].edit.propsInDeep = [];
    data.Deeps[2].server.update = '/api/v5/activity?cmd=update';
    data.Deeps[2].server.delete = '/api/v5/activity?cmd=delete';
    data.Deeps[2].server.get = '/api/v5/activity?cmd=get';
}
export { Demo }
function Demo(data){
   //courde
  var courses =[];
  for(var i=0;i<100;i++){
      courses.push({
          Title: 'Khóa học ' + i,
          VideoLink: 'https://www.youtube.com/watch?v=oCXDT0S1kLU',
          CertHtml:'<p>this is P '+i+'</p>',
          BgImage: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wHgz?ver=02d3',
          ID: i+ 1
      })
  }
  var lessons =[];
  for(i=0;i<500;i++){
      lessons.push({
          Title: 'Bài học ' + i,
          ID: i+ 1,
          CourseID: i%9,
          MedalHtml: '<p>this is P '+i+'</p>',
          ActivityHtml: '<p>this is P '+i+'</p>'
      })
  }

  var activities =[];
  for(i=0;i<300;i++){
    activities.push({
          Title: 'Hoạt động ' + i,
          ID: i+ 1,
          LessonID: i%9,
          
      })
  }
  data.Deeps[0].items= courses;
  data.Deeps[1].items= lessons;
  data.Deeps[2].items= activities;
}
export {Demo}
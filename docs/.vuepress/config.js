
module.exports = {
  title: "iFLYOS文档中心",
  lang: "zh-CN",
  description: "快速了解和接入iFLYOS",
  head: [
    ["link", { rel: "icon", href: `/favicon.ico`, type: "image/x-icon" }]
  ],
  dest:'public',
  base:'/vuepress-docs-pro/',
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "教程", link: "/learn/" },
      { text: "指南", link: "/guide/" },
      {
        text: "设备接入",
        link: "/flow/"
      }
    ],
    sidebar: {
      "/guide/":[
        'info'
      ],
      "/learn/":[
          'install',
          'introduce'
      ],
      "/flow/": [
        "",
        {
          title: "控制台配置",
          children: [
            "console/global_conf",
            "console/node",
            "console/intent",
            "console/dictionary",
            "console/speech",
            "console/build_pub"
          ]
        },
        "design",
        "online_api"
      ]
    }
  },
  plugins: [],
  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-container'), 'cumstom', {

        validate: function(params) {
          console.log("-----------------------")
          console.log(params.trim().match(/^version\s+(.*)$/))
          return params.trim().match(/^version\s+(.*)$/);
        },
      
        render: function (tokens, idx) {
          console.log(111111111)
          var m = tokens[idx].info.trim().match(/^version\s+(.*)$/);
          // console.log(md.utils.escapeHtml(m[1]))
          if (tokens[idx].nesting === 1) {
            // opening tag
            return '<div class="'+md.utils.escapeHtml(m[1])+'"><summary></summary>\n';
      
          } else {
            // closing tag
            return '</div>\n';
          }
        }
      });
    },
    // extendMarkdown: md => {
    //   md.use(require('markdown-it-container'), 'cumstom', {
    //     validate: function(params) {
    //         return params.trim().match(/^eg\s+(.*)$/) || params.trim().match(/^version\s+(.*)$/)
    //     },
    //     render: function (tokens, idx) {
    //         if (tokens[idx].nesting === 1) {
    //             // opening tag
    //             let custom = tokens[idx].info.trim()
    //             if (custom.indexOf('eg') >= 0) {
    //                 var m = tokens[idx].info.trim().match(/^eg\s+(.*)$/);
    //                 return `<div class="custom-block eg"><p class="custom-block-title">${md.utils.escapeHtml(m[1])}</p>`
    //             } else {
    //                 var m = tokens[idx].info.trim().match(/^version\s+(.*)$/);
    //                 return `<div class="${md.utils.escapeHtml(m[1])}">`;
    //             }
    //         } else {
    //             // closing tag
    //             return '</div>\n';
    //         }
    //     }
    //   });
    // } 
  }
};

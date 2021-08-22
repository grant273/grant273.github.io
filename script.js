const HEADER = String.raw`<pre class="no-wrap">
   _____                 _     _  ___ _      _     
  / ____|               | |   | |/ / (_)    | |    
 | |  __ _ __ __ _ _ __ | |_  | ' /| |_  ___| |__  
 | | |_ | '__/ _\`| '_ \| __| |  < | | |/ __| '_ \ 
 | |__| | | | (_| | | | | |_  | . \| | | (__| | | |
  \_____|_|  \__,_|_| |_|\__| |_|\_\_|_|\___|_| |_|
 --------------------------------------------------
|     <a href="#about" data-cmd="cat about">About</a>     |    <a href="#projects" data-cmd="cat projects">Projects</a>      |     <a href="#resume" data-cmd="cat resume">Resume</a>    |
 --------------------------------------------------

</pre>
`;

var pages = {
  about: `<pre>
Welcome to my website. I am Grant Klich. I'm currently a software engineer at Hurdlr, and I often make things for fun. Check out my projects above. You can get in touch at <a href="mailto:kgrant17@vt.edu">kgrant17@vt.edu</a>, or checkout my <a href="https://www.linkedin.com/in/grant-klich-24967b126/">LinkedIn</a> and <a href="https://github.com/grant273/">GitHub</a>.

<pre>`,

  projects: String.raw`<pre>

Fun stuff I’ve made. I hope you may find them interesting or useful:
   - <a href="https://copyclip.io" data-cmd="open https://copyclip.io">copyclip.io</a>      Instant no-frills text/file sharing
   - <a href="https://numberstack.io"  data-cmd="open https://numberstack.io">numberstack.io</a>   A fun, reverse-polish math game    
   - <a href="https://grantklich.com/tripper/">Tripper</a>          A simple trip-oriented grocery shopping list 
   - <a href="https://grantklich.com/extended-monty-hall/">Monty Hall</a>       Interactive explanation of the famous Monty Hall Problem. Written in Vue.js
   - <a href="https://github.com/grant273/phone-nab">Phone Nab</a>        A proof-of-concept ransomware program for public phone charging stations
   - <a href="https://tiniestviolin.com">Tiniest Violin</a>        The tiniest violin for the saddest problems
    
</pre>`, //TODO include https://grant273.github.io/namegame/ once namegame is fixed for desktop

  resume: String.raw`<pre>
  <a href="/resume.pdf">(Open as pdf)</a>

---- Education -------------------------------------------------------------------------------------------------
|
|     B.S. in Computer Science, Minor in Cybersecurity, expected May 2021
|     Virginia Tech, Blacksburg, Virginia
|     3.86 GPA
|
|    Selected Coursework: 
|     - Computer Systems (Unix, C, Assembly)
|     - Cloud Software Development (Angular, MongoDB, Node)
|     - Mobile Development for Android (Kotlin)
|     - Data Structures and Algorithms (Java)
|     - Cryptography
|     - Public Speaking
|
---- Work Experience -------------------------------------------------------------------------------------------
|
|     Software Engineering Intern | Chartio | June 2019 – Present
|  
|     - Develop features for advanced business intelligence software product using primarily Python, JavaScript, 
|    Django and React
|     - Work on conversions team to successfully boast percentage of trialers who become paying customers
|  
|    ----------------------------------------------------------------------------------------------------------
|  
|  
|     Software Consultant | Acumen Tech LLC for KSB Inc |  August 2017 - Present
|  
|     - Develop and maintain PHP web application to create/manage pump orders. Application has 100’s
|     of users nationwide and facilitates several $1,000’s in sales monthly.
|     - Developed Python code to routinely sync sales data to HubSpot via API. Saves hundreds per month as an
|     alternative to a paid enterprise tool.
|     - Developed a PHP visitor sign-in, logging, and name-badge system for office.
|  
|  
|    ----------------------------------------------------------------------------------------------------------
|  
|     Software Developer Intern | Virginia Department of Alcoholic Beverage Control  | June 2016 - August 2018
|  
|     - Developed functionality for internal payroll system, using skills in web development, Java, Spring
|       Framework, JavaScript, AJAX, and Oracle/SQL.
|     - Developed code to generate user-friendly PDF reports from massive databases using Oracle BI and SQL
| 
| 
|  
---- Skills & Exposures ----------------------------------------------------------------------------------------
|   
|     Python   JavaScript/ES6  Django   React  Angular  PHP  SQL  HTML  CSS  JavajQuery  Kotlin  C  Linux  
|     
|     Spring   MVC  Git  Agile PM
|
----------------------------------------------------------------------------------------------------------------

  </pre>`,

}
$(function() {

  term = $('#terminal').terminal(
    [
      {
        // interpreters
        ls: function(value) {
          return "<pre>about    projects    resume</pre>";
        },
        cat: function(value) {
          if (pages[value]) {
            this.echo(pages[value], {raw: true, wrap: true});
            window.location.hash = value;
          } else {
            this.echo(`cat: ${value}: No such file or directory`);
          }
        },
        open: function(value) {
          var win = window.open(value, '_blank');
        },
      },
    ],
    {
      greetings: HEADER,

      raw: true, // need for anchor tags

      onInit: function(terminal) {
        attachLinkHandler();
        const page = window.location.hash.split('#')[1];
        if (window.location.hash && pages[page]) {
          this.exec(`cat ${page}`);
        } else {
          this.exec("cat about");
        }
      },

      onAfterCommand: function(command) {
        if (clearIfFull(command)) {
          this.exec(command);
        }
        attachLinkHandler();
      },
    },

  );

  function attachLinkHandler() {
    $("a").off('click auxclick').on('click auxclick', function(e) {
      if (e.button === 2) {
        return; // do not handle right clicks
      }
      e.preventDefault();
      if (e.target.dataset.cmd){
        term.exec(e.target.dataset.cmd);
      } else {
        term.exec(`open ${e.target.href}`);
      }
    });
  }

  function clearIfFull(cmd) {
    if (cmd === "clear") {
      return false;
    }

    if ($(".terminal .terminal-output").children().length === 3) {
      return false;
    }

    if ($(".terminal")[0].offsetHeight > window.innerHeight) {
      term.exec("clear");
      term.echo(HEADER);
      return true;
    }
    return false;
  }
});

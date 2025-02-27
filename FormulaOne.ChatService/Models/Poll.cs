using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FormulaOne.ChatService.Models
{
    public class Poll
    {
        public string Question {get;set;}
        public List<string> Options {get;set;}
        public int[] Votes {get;set;}
    }
}
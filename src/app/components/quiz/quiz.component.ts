import { Component, OnInit } from '@angular/core';
import { NgIf , NgFor } from '@angular/common';
import quizz_questions from "../../../assets/data/quizz_questions.json"
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit{
  
  title:string = ""
  questions:any
  questionSelected:any

  answers:string[] = []
  answerSelected:string = ""

  questionindex:number = 0
  questionMaxIndex:number = 0

  finished:boolean = false

  constructor(){}

  ngOnInit(): void {
    if(quizz_questions){
      this.finished = false
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionindex]

      this.questionindex = 0
      this.questionMaxIndex = this.questions.length
    }
  }

  playerChoice(value:string){
    this.answers.push(value)
    this.nextStep()
  }

  async nextStep(){
    this.questionindex+=1

    if(this.questionMaxIndex > this.questionindex){
      this.questionSelected = this.questions[this.questionindex]
    }else{
      const finalAnswer:string = await this.checkResult(this.answers)
      this.finished = true
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]
    }
  }

  async checkResult(answers:string[]){
    const result = answers.reduce((previous, current, i , arr) =>{
      if(arr.filter(item => item === previous).length > 
        arr.filter(item => item === current).length)
        {
          return previous
      }else{
        return current
      }
    })
    return result
  }
}

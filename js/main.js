Vue.component('fourth_columns', {
    props: ['column'],
    template: `
        <div class="columns">
            <h3>{{ column.completedTasks.name }}</h3>
            <div class="task_complete" v-for="(task, index) in column.completedTasks.task">  
            
                <p v-if="task.inDeadline" style="color: darkgreen" class="in_dead_line_p">Работа выполнена в срок</p>
                <p v-else style="color: darkred" class="in_dead_line_p">Работа просрочена</p>
                 
                <p>Имя: {{ task.title }}</p>
                <div>
                    <p>Описание: </p>
                    <textarea readonly>{{ task.description }}</textarea>
                </div>
                <p v-for="p in task.tasks">Задача: {{ p }}</p>
                <p style="color: #9B2D30"> дедлайн {{ task.deadline }}</p>
                <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
            </div>
        </div>
    `
})

Vue.component('third_columns', {
    props: ['column', 'redactedTasks', 'saveRedactedTasks'],
    template: `
        <div class="columns">
            <h3>{{ column.testing.name }}</h3>

            <div class="task" v-for="(task, index) in column.testing.task">
            
                <div v-show="!task.toBackMenu">
                    
                    <div v-show="!task.cardRedacted" class="none-redacted">
                
                
                        <div class="top_button">
                        
                            <div @click="task.toBackMenu = true" class="back">
                                <p>←</p>
                            </div>
                        
                            <div @click="redactedTasks(task)" class="redacted_button">
                                <p>Изменить карточку</p>
                            </div>
                            
                            <div @click="goToFourth(index)" class="next">
                                <p>→</p>
                            </div>
                        </div>
                        
                        <p>Имя: {{ task.title }}</p>
                        <div>
                            <p>Описание: </p>
                            <textarea readonly>{{ task.description }}</textarea>
                        </div>
                        <p v-for="p in task.tasks">Задача: {{ p }}</p>
                        <p style="color: #9B2D30"> дедлайн {{ task.deadline }}</p>
                        <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                    </div>
                
                    <div v-show="task.cardRedacted" class="redacted-mode">
                    
                        <div @click="saveRedactedTasks(task)" class="saveRedacted_button">
                            <p>Сохранить карточку</p>
                        </div>
                    
                        <div style="display: inline">
                            <p>Имя: </p>
                            <input class="edit_input" v-model="task.editedTitle" :placeholder="task.title" type="text">
                        </div>
                        <div>
                            <p>Описание: </p>
                            <input class="edit_input" v-model="task.editedDescription" :placeholder="task.description" type="text">
                        </div>
                        <div v-for="(p, index) in task.tasks" style="display: inline">
                            <p>Задача {{ index + 1 }}: 
                                <input class="edit_input" v-model="task.editedTasks[index]" :placeholder="p" type="text">
                            </p>
                        </div>
                        <div style="display: inline">
                            <p style="color: #9B2D30"> дедлайн</p>
                            <input class="edit_input" v-model="task.editedDeadline" type="datetime-local">
                        </div>
                        <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                    </div>
                    
                </div>
                
                <div class="back_div" v-show="task.toBackMenu">
                
                    <div class="back_div_exit">
                        <p>Вернуть назад?</p>
                        <div @click="task.toBackMenu = false" class="exit">x</div>
                    </div>
                    <input type="text" placeholder="причина возврата назад" class="edit_input" v-model="task.backDescriptionNow">
                    <div @click="saveBackRedacted(index)" class="saveRedacted_button">Переместить назад</div>
                
                </div>
            
            </div>
            
        </div>
    `,
    methods: {
        goToFourth(index) {
            let task = this.column.testing.task[index];
            this.column.testing.task.splice(index, 1);

            if (task.deadline != 'не задан') {
                let currentDate = new Date();
                let deadlineDate = new Date(task.deadline);

                if (currentDate <= deadlineDate) {
                    task.inDeadline = true;
                } else {
                    task.inDeadline = false;
                }
            } else {
                task.inDeadline = true;
            }

            this.$root.columns.completedTasks.task.push(task);
        },
        saveBackRedacted(index) {
            let task = this.column.testing.task[index];

            if (!task.backDescriptionNow || task.backDescriptionNow.trim() === '') {
                task.backDescription.push('не указана');
            }
            else {
                task.backDescription.push(task.backDescriptionNow)
            }
            task.dateCreated = new Date();
            this.column.testing.task.splice(index, 1);
            this.$root.columns.tasksInProgress.task.push(task);
            task.toBackMenu = false;
        },
    }
})

Vue.component('second_columns', {
    props: ['column', 'redactedTasks', 'saveRedactedTasks'],
    template: `
        <div class="columns">
            <h3>{{ column.tasksInProgress.name }}</h3>
            <div class="task" v-for="(task, index) in column.tasksInProgress.task" :class="{ 'task_back': task.backDescription[0] != null }">
                <div v-show="!task.cardRedacted" class="none-redacted">
                
                    <div class="top_button">
                        <div @click="redactedTasks(task)" class="redacted_button">
                            <p>Изменить карточку</p>
                        </div>
                        
                        <div @click="goToThird(index)" class="next">
                            <p>→</p>
                        </div>
                    </div>
                    
                    <p>Имя: {{ task.title }}</p>
                    <div>
                        <p>Описание: </p>
                        <textarea readonly>{{ task.description }}</textarea>
                    </div>
                    <p v-for="p in task.tasks">Задача: {{ p }}</p>
                    <p style="color: #9B2D30"> дедлайн {{ task.deadline }}</p>
                    
                    <p class="back_text" v-show="task.backDescription[0] != null">Причины возвращений -</p>
                    <p v-for="backDescription in task.backDescription">{{ backDescription }}</p>
                    
                    <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                </div>
                
                <div v-show="task.cardRedacted" class="redacted-mode">
                
                    <div @click="saveRedactedTasks(task)" class="saveRedacted_button">
                        <p>Сохранить карточку</p>
                    </div>
                
                    <div style="display: inline">
                        <p>Имя: </p>
                        <input class="edit_input" v-model="task.editedTitle" :placeholder="task.title" type="text">
                    </div>
                    <div>
                        <p>Описание: </p>
                        <input class="edit_input" v-model="task.editedDescription" :placeholder="task.description" type="text">
                    </div>
                    <div v-for="(p, index) in task.tasks" style="display: inline">
                        <p>Задача {{ index + 1 }}: 
                            <input class="edit_input" v-model="task.editedTasks[index]" :placeholder="p" type="text">
                        </p>
                    </div>
                    <div style="display: inline">
                        <p style="color: #9B2D30"> дедлайн</p>
                        <input class="edit_input" v-model="task.editedDeadline" type="datetime-local">
                    </div>
                    <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                </div>
            </div>
        </div>
    `,
    methods: {
        goToThird(index) {
            let task = this.column.tasksInProgress.task[index];
            this.column.tasksInProgress.task.splice(index, 1);
            this.$root.columns.testing.task.push(task);
        }
    }
})

Vue.component('first_columns', {
    props: ['column', 'redactedTasks', 'saveRedactedTasks'],
    template: `
        <div class="columns">
            <h3>{{ column.scheduledTasks.name }}</h3>
            <div class="task" v-for="(task, index) in column.scheduledTasks.task" :key="index">
                
                <div v-show="!task.cardRedacted" class="none-redacted">
                
                    <div class="top_button">
                        <div @click="redactedTasks(task)" class="redacted_button">
                            <p>Изменить карточку</p>
                        </div>
                        
                        <div @click="goToSecond(index)" class="next">
                            <p>→</p>
                        </div>
                    </div>
                    
                    <p>Имя: {{ task.title }}</p>
                    <div>
                        <p>Описание: </p>
                        <textarea readonly>{{ task.description }}</textarea>
                    </div>
                    <p v-for="p in task.tasks">Задача: {{ p }}</p>
                    <p style="color: #9B2D30"> дедлайн {{ task.deadline }}</p>
                    <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                </div>
                
                <div v-show="task.cardRedacted" class="redacted-mode">
                
                    <div @click="saveRedactedTasks(task)" class="saveRedacted_button">
                        <p>Сохранить карточку</p>
                    </div>
                
                    <div style="display: inline">
                        <p>Имя: </p>
                        <input class="edit_input" v-model="task.editedTitle" :placeholder="task.title" type="text">
                    </div>
                    <div>
                        <p>Описание: </p>
                        <input class="edit_input" v-model="task.editedDescription" :placeholder="task.description" type="text">
                    </div>
                    <div v-for="(p, index) in task.tasks" style="display: inline">
                        <p>Задача {{ index + 1 }}: 
                            <input class="edit_input" v-model="task.editedTasks[index]" :placeholder="p" type="text">
                        </p>
                    </div>
                    <div style="display: inline">
                        <p style="color: #9B2D30"> дедлайн</p>
                        <input class="edit_input" v-model="task.editedDeadline" type="datetime-local">
                    </div>
                    <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }}</p>
                </div>
            </div>
        </div>
    `,
    methods: {

        goToSecond(index) {
            let task = this.column.scheduledTasks.task[index];
            this.column.scheduledTasks.task.splice(index, 1);
            this.$root.columns.tasksInProgress.task.push(task);
        }
    }
})

Vue.component('create_new_task_component', {
    template: `
        <div>
            <div class="create_new_task_box">
                <div class="create_new_task_input-block">
                    <input type="text" placeholder="заголовок" v-model="title" class="input">
                    <input type="text" placeholder="описание" v-model="description" class="input">
                    
                    <input type="text" placeholder="первая задача" v-model="tasks.task1" class="input">    
                    <input type="text" placeholder="вторая задача" v-model="tasks.task2" class="input">
                    <input type="text" placeholder="третья задача" v-model="tasks.task3" class="input">  
                    
                    <input type="datetime-local" placeholder="дедлайн" v-model="deadline" class="input">                  
                    
                </div>
                
                <div class="create_new_task_button" @click="addNewTask">
                    <p>Создать новую задачу</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            title: '',
            description: '',
            tasks: {
                task1: '',
                task2: '',
                task3: '',
            },
            deadline: ''
        }
    },
    methods: {
        addNewTask() {
            let task = {
                dateCreated: new Date(),
                title: this.title || 'Без имени',
                description: this.description || 'Без описания',
                tasks: [
                    this.tasks.task1 || 'Без имени',
                    this.tasks.task2 || 'Без имени',
                    this.tasks.task3 || 'Без имени'
                ].filter(task => task !== ''),
                deadline: this.deadline || 'не задан',
                cardRedacted: false,
                editedTitle: '',
                editedDescription: '',
                editedTasks: [],
                editedDeadline: '',
                toBackMenu : false,
                backDescription: [],
                backDescriptionNow: null,
                inDeadline: false,
            }

            this.$root.columns.scheduledTasks.task.push(task);

            this.title = '';
            this.description = '';
            this.tasks.task1 = '';
            this.tasks.task2 = '';
            this.tasks.task3 = '';
            this.deadline = '';
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        columns: {
            scheduledTasks: {
                name: 'Запланированные задачи',
                task: [],
            },
            tasksInProgress: {
                name: 'Задачи в работе',
                task: [],
            },
            testing: {
                name: 'Тестирование',
                task: [],
            },
            completedTasks: {
                name: 'Выполненные задачи',
                task: [],
            }
        },
    },
    methods: {
        redactedTasks(task) {
            task.editedTitle = task.title;
            task.editedDescription = task.description;
            task.editedTasks = [...task.tasks];
            task.editedDeadline = task.deadline !== 'не задан' ? task.deadline : '';
            task.cardRedacted = true;
        },

        saveRedactedTasks(task) {
            task.title = task.editedTitle;
            task.description = task.editedDescription;

            if (task.editedTasks) {
                task.editedTasks.forEach((editedTask, i) => {
                    if (editedTask && editedTask.trim() !== '') {
                        task.tasks[i] = editedTask;
                    }
                });
            }

            if (task.editedDeadline) {
                task.deadline = task.editedDeadline;
            }

            task.dateCreated = new Date();

            task.editedTitle = '';
            task.editedDescription = '';
            task.editedTasks = [];
            task.editedDeadline = '';

            task.cardRedacted = false;
        },
    }
})
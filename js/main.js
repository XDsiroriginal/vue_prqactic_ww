Vue.component('fourth_columns', {
    props: ['column'],
    template: `
        <div class="columns">
            <h3>{{ column.completedTasks.name }}</h3>
            <div class="task" v-for="task in column.completedTasks.task" :key="task">
                {{ task }}
            </div>
        </div>
    `
})

Vue.component('third_columns', {
    props: ['column'],
    template: `
        <div class="columns">
            <h3>{{ column.testing.name }}</h3>
            <div class="task" v-for="task in column.testing.task" :key="task">
                {{ task }}
            </div>
        </div>
    `
})

Vue.component('second_columns', {
    props: ['column'],
    template: `
        <div class="columns">
            <h3>{{ column.tasksInProgress.name }}</h3>
            <div class="task" v-for="task in column.tasksInProgress.task" :key="task">
                {{ task }}
            </div>
        </div>
    `
})

Vue.component('first_columns', {
    props: ['column'],
    template: `
        <div class="columns">
            <h3>{{ column.scheduledTasks.name }}</h3>
            <div class="task" v-for="task in column.scheduledTasks.task" :key="task">
                <p>Имя: {{ task.title }}</p>
                <div>
                    <p>Описание: </p>
                    <textarea> {{ task.description }} </textarea>
                </div>
                <p v-for="p in task.tasks">Задача: {{ p }}</p>
                <p style="color: #9B2D30"> {{ task.deadline }} </p>
                <p style="color: grey; font-size: 10px"> последне изменение: {{ task.dateCreated }} </p>
            </div>
        </div>
    `
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
                    
                    <input type="datetime-local" placeholder="третья задача" v-model="tasks.deadline" class="input">                  
                    
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
        }
    },
    methods: {
        addNewTask() {
            let task = {
                dateCreated: new Date(),
                title: this.title || 'Без имени',
                description: this.description || 'Без имени',
                tasks: [
                    this.tasks.task1 || 'Без имени',
                    this.tasks.task2 || 'Без имени',
                    this.tasks.task3 || 'Без имени'
                ].filter(task => task !== ''),
                deadline: this.deadline || 'не задан',
            }

            this.$root.columns.scheduledTasks.task.push(task);

            this.title = '';
            this.description = '';
            this.tasks.task1 = '';
            this.tasks.task2 = '';
            this.tasks.task3 = '';

            console.log('Новая задача создана:', task);
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
    }
})
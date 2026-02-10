Vue.component('board', {
    template: `
        <div>
            <div class="create_new_task_box">
                <div class="create_new_task_button"><p>Создать новую задачу</p></div>
            </div>
            
            <div class="work_box">
            
            <div v-for="column in columns" class="columns"></div>
            
            </div>
        </div>
    `,
    data() {
        return {
        }
    },
    methods: {
        columns: {
            scheduledTasks: [],
            tasksInProgress: [],
            testing: [],
            completedTasks: []
        },
    }
})

let app = new Vue({
    el: '#app',
})
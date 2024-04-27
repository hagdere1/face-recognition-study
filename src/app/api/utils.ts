export const getResultsForRole = (users: any[], role: string) => {
    const group = users.filter(user => user.role === role)
    const numOrphans = group.filter(user => user.group === 'orphan').length
    const numControl = group.filter(user => user.group === 'control').length

    const runningTotals = {
        orphan: {
            trial1: {
                time: 0,
                accuracy: 0
            },
            trial2: {
                time: 0,
                accuracy: 0
            },
            count: numOrphans
        },
        control: {
            trial1: {
                time: 0,
                accuracy: 0
            },
            trial2: {
                time: 0,
                accuracy: 0
            },
            count: numControl
        }
    }

    for (let i = 0; i < users.length; i++) {
        const user = users[i]

        if (user.group === 'orphan') {
            runningTotals.orphan.trial1.time += user.trial1.results.time
            runningTotals.orphan.trial1.accuracy += user.trial1.results.accuracy
            runningTotals.orphan.trial2.time += user.trial2.results.time
            runningTotals.orphan.trial2.accuracy += user.trial2.results.accuracy
        } else {
            runningTotals.control.trial1.time += user.trial1.results.time
            runningTotals.control.trial1.accuracy += user.trial1.results.accuracy
            runningTotals.control.trial2.time += user.trial2.results.time
            runningTotals.control.trial2.accuracy += user.trial2.results.accuracy
        }
    }

    const averages = { ...runningTotals }

    averages.orphan.trial1.time = runningTotals.orphan.trial1.time / numOrphans
    averages.orphan.trial1.accuracy = runningTotals.orphan.trial1.accuracy / numOrphans
    averages.orphan.trial2.time = runningTotals.orphan.trial2.time / numOrphans
    averages.orphan.trial2.accuracy = runningTotals.orphan.trial2.accuracy / numOrphans

    averages.control.trial1.time = runningTotals.control.trial1.time / numControl
    averages.control.trial1.accuracy = runningTotals.control.trial1.accuracy / numControl
    averages.control.trial2.time = runningTotals.control.trial2.time / numControl
    averages.control.trial2.accuracy = runningTotals.control.trial2.accuracy / numControl

    return averages
}
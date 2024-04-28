export const getResultsForRole = (users: any[], role: string) => {
    const group = users.filter(user => user.role === role)
    const numOrphans = group.filter(user => user.group === 'orphan').length
    const numControl = group.filter(user => user.group === 'control').length

    const runningTotals = {
        orphan: {
            trial1: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            trial2: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            count: numOrphans
        },
        control: {
            trial1: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            trial2: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            count: numControl
        }
    }

    for (let i = 0; i < group.length; i++) {
        const user = group[i]
        if (user.group === 'orphan') {
            runningTotals.orphan.trial1.count += 1
            runningTotals.orphan.trial1.time += user.trial1.results.time
            runningTotals.orphan.trial1.accuracy += user.trial1.results.accuracy

            runningTotals.orphan.trial2.count += 1
            runningTotals.orphan.trial2.time += user.trial2.results.time
            runningTotals.orphan.trial2.accuracy += user.trial2.results.accuracy
        } else {
            runningTotals.control.trial1.count += 1
            runningTotals.control.trial1.time += user.trial1.results.time
            runningTotals.control.trial1.accuracy += user.trial1.results.accuracy

            runningTotals.control.trial2.count += 1
            runningTotals.control.trial2.time += user.trial2.results.time
            runningTotals.control.trial2.accuracy += user.trial2.results.accuracy
        }
    }

    const averages = { ...runningTotals }

    averages.orphan.trial1.time = runningTotals.orphan.trial1.time / runningTotals.orphan.trial1.count
    averages.orphan.trial1.accuracy = runningTotals.orphan.trial1.accuracy / runningTotals.orphan.trial1.count
    averages.orphan.trial2.time = runningTotals.orphan.trial2.time / runningTotals.orphan.trial2.count
    averages.orphan.trial2.accuracy = runningTotals.orphan.trial2.accuracy / runningTotals.orphan.trial2.count

    averages.control.trial1.time = runningTotals.control.trial1.time / runningTotals.control.trial1.count
    averages.control.trial1.accuracy = runningTotals.control.trial1.accuracy / runningTotals.control.trial1.count
    averages.control.trial2.time = runningTotals.control.trial2.time / runningTotals.control.trial2.count
    averages.control.trial2.accuracy = runningTotals.control.trial2.accuracy / runningTotals.control.trial2.count

    return averages
}

export const getTrialResultsForAttribute = (users: any[], role: string, attribute: string[]) => {
    const group = users.filter(user => user.role === role)
    const numOrphans = group.filter(user => user.group === 'orphan').length
    const numControl = group.filter(user => user.group === 'control').length
    
    const runningTotals = {
        orphan: {
            trial1: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            trial2: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            count: numOrphans
        },
        control: {
            trial1: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            trial2: {
                time: 0,
                accuracy: 0,
                count: 0
            },
            count: numControl
        }
    }

    group.forEach(user => {
        user.trial1.responses.forEach((response: any) => {
            const persona = response.persona
            if (user.group === 'orphan') {
                if (persona[attribute[0]] === attribute[1]) {
                    // Total number of responses with that attribute belonging to orphan group for trial 1
                    runningTotals.orphan.trial1.count += 1 
                    runningTotals.orphan.trial1.time += response.time
                    runningTotals.orphan.trial1.accuracy += response.isCorrect ? 1 : 0
                }
            } else {
                if (persona[attribute[0]] === attribute[1]) {
                    // Total number of responses with that attribute belonging to control group for trial 1
                    runningTotals.control.trial1.count += 1
                    runningTotals.control.trial1.time += response.time
                    runningTotals.control.trial1.accuracy += response.isCorrect ? 1 : 0
                }
            }
        })
        user.trial2.responses.forEach((response: any) => {
            const persona = response.persona
            if (user.group === 'orphan') {
                if (persona[attribute[0]] === attribute[1]) {
                    // Total number of responses with that attribute belonging to orphan group for trial 2
                    runningTotals.orphan.trial2.count += 1 
                    runningTotals.orphan.trial2.time += response.time
                    runningTotals.orphan.trial2.accuracy += response.isCorrect ? 1 : 0
                }
            } else {
                if (persona[attribute[0]] === attribute[1]) {
                    // Total number of responses with that attribute belonging to control group for trial 2
                    runningTotals.control.trial2.count += 1
                    runningTotals.control.trial2.time += response.time
                    runningTotals.control.trial2.accuracy += response.isCorrect ? 1 : 0
                }
            }
        })
    })

    const averages = { ...runningTotals }

    averages.orphan.trial1.time = runningTotals.orphan.trial1.time / runningTotals.orphan.trial1.count
    averages.orphan.trial1.accuracy = runningTotals.orphan.trial1.accuracy / runningTotals.orphan.trial1.count
    averages.orphan.trial2.time = runningTotals.orphan.trial2.time / runningTotals.orphan.trial2.count
    averages.orphan.trial2.accuracy = runningTotals.orphan.trial2.accuracy / runningTotals.orphan.trial2.count

    averages.control.trial1.time = runningTotals.control.trial1.time / runningTotals.control.trial1.count
    averages.control.trial1.accuracy = runningTotals.control.trial1.accuracy / runningTotals.control.trial1.count
    averages.control.trial2.time = runningTotals.control.trial2.time / runningTotals.control.trial2.count
    averages.control.trial2.accuracy = runningTotals.control.trial2.accuracy / runningTotals.control.trial2.count

    return averages
}
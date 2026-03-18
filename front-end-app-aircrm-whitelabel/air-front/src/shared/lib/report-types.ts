export enum ReportType {
    arrival = 'arrival',
    sales = 'sales',
    // flow = 'flow',
    // 'write-off' = 'write-off'
}

export type ReportTypeType = keyof typeof ReportType

export type ReportTypeLabels = {
    [key in ReportTypeType]: {
        label: string,
    }
}

export const reportTypeLabels: ReportTypeLabels = {
    [ReportType.arrival]: {
        label: 'Приход',
    },
    [ReportType.sales]: {
        label: 'Реализация',
    },
    // [ReportType.flow]: {
    //     label: 'Перемещение',
    // },
    // [ReportType['write-off']]: {
    //     label: 'Списание',
    // },
}
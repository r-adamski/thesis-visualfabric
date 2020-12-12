
export interface Signature{
    creator_msp_id: string,
    signature: string
}

export interface Write{
    key: string,
    is_delete: boolean,
    value: string
}

export interface HashInfo{
    key_hash: string,
    block_num?: string, //long up to 64bit
    tx_num?: string, //long up to 64bit
    is_delete?: boolean,
    value_hash?: string
}

export interface CollectionHashedRWSet{
    collection_name: string,
    hashed_reads: HashInfo[],
    hashed_writes: HashInfo[] ,
    pvt_rwset_hash: string
}

//if namespace === lscc ignore
export interface RWSet{
    namespace: string,
    rwset: {
        reads: string[],
        range_queries_info: string[],
        writes: Write[]
    },
    collection_hashed_rwset: CollectionHashedRWSet[]
}

export interface Action{
    header: {
        creator_msp_id: string,
        creador_id_bytes: string
    },
    chaincode_proposal_payload: {
        type: number,
        typeString: string,
        input: {
            args: string[],
            decorations?: string,
            is_init: boolean
        },
        chaincode_id_name: string
    },
    proposal_response_payload: {
        proposal_hash: string,
        results:  {
            data_model: number,
            ns_rwset: RWSet[]
        },
        events: {
            chaincode_id: string,
            tx_id: string,
            event_name: string
            payload: string
        },
        response: {
            status: number,
            message: string
            payload: string
        },
        chaincode_id: {
            path: string,
            name: string,
            version: string
        }
    },
    endorsements: Signature[]
}

export interface BlockData{
    signature: string,
    channel_header: {
        type: number,
        version: number,
        timestamp: string,
        channel_id: string,
        tx_id: string,
        extension: string,
        typeString: string
    },
    signature_header: {
        creator_msp_id: string,
        creator_id_bytes: string
    },
    actions: Action[]
}

export interface Block{
    header: {
        number: string, //long up to 64bit
        previous_hash: string,
        data_hash: string
    },
    data: BlockData[],
    metadata: {
        value: string,
        signatures: Signature[]
    }
}

export interface MapEntry{
    id: string,
    data: Block
}
import PeerId from 'peer-id'
import { createPeer, P2PNode, uint8ArrayFromString, uint8ArrayToString } from "./utils"

// number of nodes
const N_NODES = +process.argv[2] || 10
const N_CONNECT = +process.argv[3] || 3
// Prints message on peer discovery
const DISCOVERY_HOOK = false
// Print message payload on recieve
const PRINT_RECEIVED_MSG = false
// Print average message latency
const PRINT_AVG_LATENCY = true
const TOPIC = 'news'

var nLeft = N_NODES

interface Payload {
    // From node index
    from: number,
    // Timestamp
    ts: number,
}

function setOnDiscoveryHook(node: P2PNode, id2Nodes: Map<String, P2PNode>) {
    node.p.on('peer:discovery', (peerId: PeerId) => console.log(`[node ${node.index}] Discovered: node ${id2Nodes.get(peerId.toB58String())?.index}`))
}

function subscribeTopic(node: P2PNode) {
    var minLatency = 0
    var maxLatency = 0
    var totalMS = 0
    var totalMsg = 0
    node.p.pubsub.on(TOPIC, (msg) => {
        const ts = new Date().getTime()
        const payloadStr = uint8ArrayToString(msg.data)
        const payload: Payload = JSON.parse(payloadStr)
        const latency = ts - payload.ts
        if (minLatency == 0 || minLatency > latency) {
            minLatency = latency
        }
        if (maxLatency == 0 || maxLatency < latency) {
            maxLatency = latency
        }
        totalMS += latency
        totalMsg += 1
        if (PRINT_RECEIVED_MSG) {
            console.log(`node ${node.index} received: ${uint8ArrayToString(msg.data)} at ${ts}, latency ${latency}ms`)
        }
        if (PRINT_AVG_LATENCY && totalMsg == N_NODES - 1) {
            console.log(`[${nLeft}] node ${node.index} msg latency, avg: ${totalMS / totalMsg}ms, max: ${maxLatency}ms, min: ${minLatency}ms`)
            nLeft -= 1
            if (nLeft == 0) {
                process.exit(0)
            }
        }
    })
    node.p.pubsub.subscribe(TOPIC)
}

async function main() {
    console.log(`N_NODES: ${N_NODES}, N_CONNECT: ${N_CONNECT}`)
    const nodes: P2PNode[] = []
    const id2Nodes = new Map<String, P2PNode>()
    // Create nodes
    console.log('Creating nodes')
    for (var i = 0; i < N_NODES; i++) {
        const node = await createPeer(i)
        nodes.push(node)
        id2Nodes.set(node.pid, node)
        if (DISCOVERY_HOOK) {
            setOnDiscoveryHook(node, id2Nodes)
        }
        subscribeTopic(node)
    }
    // Connect nodes
    console.log('Connecting nodes')
    for (var i = 0; i < N_NODES; i++) {
        const node = nodes[i]
        for (var j = 1; j <= N_CONNECT; j++) {
            const other = nodes[(i + j) % N_NODES]
            await node.p.peerStore.addressBook.set(other.p.peerId, other.p.multiaddrs)
            await node.p.dial(other.p.peerId)
        }
    }
    console.log('Starting pubsub')
    for (var i = 0; i < N_NODES; i++) {
        const node = nodes[i]
        node.p.pubsub.publish(TOPIC, uint8ArrayFromString(JSON.stringify({
            from: i,
            ts: new Date().getTime()
        } as Payload)))
    }
}

main()

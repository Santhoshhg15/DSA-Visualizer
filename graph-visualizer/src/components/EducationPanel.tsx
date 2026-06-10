import { ConceptCard } from './ConceptCard';
import { GraphIntroDiagram } from './diagrams/GraphIntroDiagram';
import { VertexDiagram } from './diagrams/VertexDiagram';
import { EdgeDiagram } from './diagrams/EdgeDiagram';
import { DirectedUndirectedDiagram } from './diagrams/DirectedUndirectedDiagram';
import { WeightedUnweightedDiagram } from './diagrams/WeightedUnweightedDiagram';
import { CyclicAcyclicDiagram } from './diagrams/CyclicAcyclicDiagram';
import { AdjacencyDiagram } from './diagrams/AdjacencyDiagram';

export function EducationPanel() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          📚
        </span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Graph Fundamentals
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <ConceptCard
          title="What is a Graph?"
          definition="A non-linear data structure made of Vertices connected by Edges."
          explanation="Unlike arrays or trees, graphs can represent any relationship between objects — social networks, maps, web pages, dependencies. A graph G is formally defined as G = (V, E) where V is a set of vertices and E is a set of edges connecting pairs of vertices."
          keyFacts={[
            "Used in GPS, social networks, compilers",
            "Can have cycles unlike trees",
            "Vertices = entities, Edges = relationships"
          ]}
        >
          <GraphIntroDiagram />
        </ConceptCard>

        <ConceptCard
          title="What is a Vertex (Node)?"
          definition="A fundamental unit of a graph representing an entity or object."
          explanation="A vertex (plural: vertices) is the basic building block of a graph. It stores data and can be connected to any number of other vertices. Unlike a tree node which has a parent-child constraint, a graph vertex can connect to ANY other vertex freely. Vertices are also called nodes or points."
          keyFacts={[
            "Also called Node or Point",
            "Can have 0 connections (isolated vertex)",
            "Degree = number of edges connected to it"
          ]}
        >
          <VertexDiagram />
        </ConceptCard>

        <ConceptCard
          title="What is an Edge?"
          definition="A connection between two vertices representing a relationship."
          explanation="An edge links two vertices together. In an undirected graph, edges have no direction — the relationship goes both ways. In a directed graph, edges have a direction (shown with an arrow) meaning the relationship is one-way. Edges can also carry a weight (cost/distance)."
          keyFacts={[
            "Self-loop: edge from a vertex to itself",
            "Parallel edges: multiple edges between same vertices",
            "Weight: a numeric value assigned to an edge"
          ]}
        >
          <EdgeDiagram />
        </ConceptCard>

        <ConceptCard
          title="Directed vs Undirected Graph"
          definition="Directed edges flow one way. Undirected edges flow both ways."
          explanation="In an Undirected Graph, if A is connected to B then B is also connected to A — the relationship is mutual. Example: friendship networks. In a Directed Graph (Digraph), each edge has a source and destination. A→B does NOT mean B→A. Example: Twitter following, web page links, task dependencies."
          keyFacts={[
            "Undirected: Edge (A,B) = Edge (B,A)",
            "Directed: Edge (A→B) ≠ Edge (B→A)",
            "Directed graphs are used in scheduling, routing"
          ]}
        >
          <DirectedUndirectedDiagram />
        </ConceptCard>

        <ConceptCard
          title="Weighted vs Unweighted Graph"
          definition="Weighted graphs assign a numeric cost to each edge. Unweighted graphs treat all edges as equal."
          explanation="In an Unweighted Graph, all edges are considered equal. Shortest path = fewest edges. In a Weighted Graph, each edge has a cost (distance, time, price). Shortest path = minimum total cost. Most real-world graph problems (maps, networks) use weighted graphs."
          keyFacts={[
            "Weights can represent distance, time, or cost",
            "Dijkstra, Kruskal, Prim require weighted graphs",
            "BFS works on unweighted for shortest path"
          ]}
        >
          <WeightedUnweightedDiagram />
        </ConceptCard>

        <ConceptCard
          title="Cyclic vs Acyclic Graph"
          definition="A cyclic graph has at least one cycle. An acyclic graph has no cycles."
          explanation="A cycle is a path that starts and ends at the same vertex. Cyclic graphs are common in road networks and social graphs. Acyclic graphs have no such loops. A DAG (Directed Acyclic Graph) is a directed graph with no cycles — used in task scheduling, build systems, and course prerequisites. Topological Sort only works on DAGs."
          keyFacts={[
            "DAG = Directed Acyclic Graph",
            "Trees are a special case of DAGs",
            "Topological Sort only works on DAGs"
          ]}
        >
          <CyclicAcyclicDiagram />
        </ConceptCard>

        {/* This one might span both columns on large screens if desired, or stay in grid */}
        <div className="lg:col-span-2 max-w-4xl mx-auto w-full">
          <ConceptCard
            title="Adjacency List vs Adjacency Matrix"
            definition="Two ways to represent a graph in memory."
            explanation="Adjacency List: each vertex stores a list of its neighbors. Space efficient for sparse graphs. O(V+E) space. Adjacency Matrix: a 2D grid where matrix[i][j] = 1 means edge exists from i to j. Fast lookup O(1) but uses O(V²) space. Better for dense graphs. Most algorithm implementations prefer Adjacency List."
            keyFacts={[
              "List: O(V+E) space, good for sparse graphs",
              "Matrix: O(V²) space, good for dense graphs",
              "Most algorithms use Adjacency List"
            ]}
          >
            <AdjacencyDiagram />
          </ConceptCard>
        </div>

      </div>
    </div>
  );
}
